import axios from 'axios';
import { getAccessToken } from '@/lib/auth-tokens';

export const IDENTITY_API_BASE_URL =
  (import.meta.env.VITE_IDENTITY_API_URL as string | undefined) ?? 'http://localhost:8092';

export const identityApi = axios.create({
  baseURL: IDENTITY_API_BASE_URL,
  timeout: 10000,
});

identityApi.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
