import axios from 'axios'
import { getAccessToken } from '@/lib/auth-tokens'

export const CODING_CONCEPT_API_BASE_URL =
  (import.meta.env.VITE_CODING_CONCEPT_API_BASE_URL as string | undefined) ??
  'http://localhost:3011/api/v1'

export const codingConceptApi = axios.create({
  baseURL: CODING_CONCEPT_API_BASE_URL,
  timeout: 15000,
})

codingConceptApi.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export function codingConceptEndpoint(path = '') {
  return `${CODING_CONCEPT_API_BASE_URL}${path}`
}
