import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { clearTokens, getAccessToken, getRefreshToken, persistTokens } from '@/lib/auth-tokens';
import { IDENTITY_API_BASE_URL } from '@/lib/identity-api';

export const LIS_API_BASE_URL =
  (import.meta.env.VITE_LIS_API_URL as string | undefined) ?? 'http://localhost:8002';

export const lisApi = axios.create({
  baseURL: LIS_API_BASE_URL,
  timeout: 15000,
});

let isRefreshing = false;
let queued: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

lisApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

lisApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!originalRequest) {
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
              resolve(lisApi(originalRequest));
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
        }>(`${IDENTITY_API_BASE_URL}/auth/refresh-token`, { refreshToken });

        persistTokens(refreshResponse.data.accessToken, refreshResponse.data.refreshToken);
        queued.forEach((entry) => entry.resolve(refreshResponse.data.accessToken));
        queued = [];

        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
        return lisApi(originalRequest);
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

    return Promise.reject(error);
  }
);
