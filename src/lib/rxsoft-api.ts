import axios, { AxiosError, type InternalAxiosRequestConfig, type AxiosRequestConfig } from 'axios';
import { clearTokens, getAccessToken, getRefreshToken, persistTokens } from '@/lib/auth-tokens';

export const RXSOFT_API_BASE_URL =
  (import.meta.env.VITE_RXSOFT_API_URL as string | undefined) ??
  'https://rxsoft-backend.onrender.com/api';

/** @deprecated Use RXSOFT_API_BASE_URL instead */
export const API_BASE_URL = RXSOFT_API_BASE_URL;

export const rxsoftApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

let isRefreshing = false;
let queued: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

rxsoftApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

rxsoftApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Network error (connection refused, timeout, etc.)
    if (!error.response) {
      const currentPath = window.location.pathname;
      const failedUrl = originalRequest.url || '';
      if (!currentPath.includes('service-unavailable')) {
        window.location.href = `/service-unavailable?return=${encodeURIComponent(currentPath)}&url=${encodeURIComponent(failedUrl)}`;
      }
      return Promise.reject(error);
    }

    if (
      status === 401 &&
      !originalRequest._retry &&
      !String(originalRequest.url).includes('/auth/')
    ) {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        window.location.href = '/sign-in';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queued.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(rxsoftApi(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post<{
          accessToken: string;
          refreshToken: string;
        }>(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });

        persistTokens(refreshResponse.data.accessToken, refreshResponse.data.refreshToken);
        queued.forEach((entry) => entry.resolve(refreshResponse.data.accessToken));
        queued = [];

        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
        return rxsoftApi(originalRequest);
      } catch (refreshError) {
        queued.forEach((entry) => entry.reject(refreshError));
        queued = [];
        clearTokens();
        window.location.href = '/sign-in';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 403) {
      window.location.href = '/403';
    }

    if (status && status >= 500) {
      console.error('Server error', error.response?.data ?? error.message);
    }

    return Promise.reject(error);
  }
);

export async function downloadBlob(config: AxiosRequestConfig, filename: string): Promise<void> {
  const response = await rxsoftApi.request<Blob>({
    ...config,
    responseType: 'blob',
  });
  const url = URL.createObjectURL(response.data);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
