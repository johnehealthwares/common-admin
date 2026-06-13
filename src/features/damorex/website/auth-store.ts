import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { websiteApi } from './api';

interface User {
  sub: string;
  username: string;
  email: string;
  phone: string;
  roles: string[];
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User, token: string) => void;
  logout: () => void;
  login: (username: string, password: string) => Promise<void>;
  register: (data: { username: string; email?: string; phone?: string; password: string }) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      login: async (username, password) => {
        const res = await websiteApi.login({ username, password });
        const token = res.accessToken;
        const payload = JSON.parse(atob(token.split('.')[1]));
        set({ user: { sub: payload.sub, username: payload.username, email: payload.email || '', phone: payload.phone || '', roles: payload.roles || [] }, token, isAuthenticated: true });
      },

      register: async (data) => { 
        const res = await websiteApi.register(data);
        const token = res.accessToken;
        const payload = JSON.parse(atob(token.split('.')[1]));
        set({ user: { sub: payload.sub, username: payload.username, email: payload.email || '', phone: payload.phone || '', roles: payload.roles || [] }, token, isAuthenticated: true });
      },
    }),
    { name: 'damorex-auth' }
  )
);
