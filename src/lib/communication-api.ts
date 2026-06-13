import axios, { AxiosError, type InternalAxiosRequestConfig, type AxiosRequestConfig } from 'axios';
import { clearTokens, getAccessToken, getRefreshToken, persistTokens } from '@/lib/auth-tokens';

export const COMMUNICATION_API_BASE_URL =
  (import.meta.env.VITE_COMMUNICATION_API_URL as string | undefined) ??
  'http://localhost:3000/api/v1';

/** @deprecated Use COMMUNICATION_API_BASE_URL instead */
export const API_BASE_URL = COMMUNICATION_API_BASE_URL;

export const communicationApi = axios.create({
  baseURL: COMMUNICATION_API_BASE_URL,
  timeout: 15000,
});

let isRefreshing = false;
let queued: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

communicationApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

communicationApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queued.push({ resolve, reject });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          clearTokens();
          window.location.href = '/sign-in';
          return Promise.reject(error);
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        persistTokens(accessToken, newRefreshToken);

        queued.forEach(({ resolve }) => resolve(accessToken));
        queued = [];

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return communicationApi(originalRequest);
      } catch (refreshError) {
        queued.forEach(({ reject }) => reject(refreshError));
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
