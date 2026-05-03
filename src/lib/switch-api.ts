import axios from 'axios'
import { getAccessToken } from '@/lib/auth-tokens'

export const SWITCH_API_BASE_URL =
  (import.meta.env.VITE_SWITCH_API_BASE_URL as string | undefined) ??
  'http://localhost:3000/api/v1'

export const switchApi = axios.create({
  baseURL: SWITCH_API_BASE_URL,
  timeout: 15000,
})

switchApi.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
