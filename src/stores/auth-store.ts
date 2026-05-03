import { create } from 'zustand'
import { rxsoftApi } from '@/lib/rxsoft-api'
import {
  clearTokens,
  decodeUserFromAccessToken,
  getAccessToken,
  getRefreshToken,
  persistTokens,
  type AuthUser,
} from '@/lib/auth-tokens'

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  user: AuthUser | null
  loading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  bootstrap: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  loading: false,
  error: null,
  login: async (username, password) => {
    set({ loading: true, error: null })
    try {
      const response = await rxsoftApi.post<{
        accessToken: string
        refreshToken: string
      }>('/auth/login', { username, password })
      persistTokens(response.data.accessToken, response.data.refreshToken)
      const user = decodeUserFromAccessToken(response.data.accessToken)

      if (!user) {
        throw new Error('Invalid access token payload.')
      }

      set({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        user,
        loading: false,
        error: null,
      })
    } catch {
      set({ loading: false, error: 'Invalid credentials' })
    }
  },
  logout: () => {
    clearTokens()
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      loading: false,
      error: null,
    })
  },
  bootstrap: () => {
    const accessToken = getAccessToken()
    const refreshToken = getRefreshToken()

    if (!accessToken || !refreshToken) return

    const user = decodeUserFromAccessToken(accessToken)
    if (!user) {
      clearTokens()
      set({ accessToken: null, refreshToken: null, user: null })
      return
    }

    set({ accessToken, refreshToken, user, loading: false, error: null })
  },
}))
