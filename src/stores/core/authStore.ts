import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthService } from '../../services/AuthService'
import type { User } from '../../types'

interface AuthState {
  isAuthenticated: boolean
  token: string | null
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  loadUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      token: null,
      user: null,

      login: async (email, password) => {
        try {
          const data = await AuthService.login({ email, password })
          set({ isAuthenticated: true, token: data.token, user: data.user })
          return true
        } catch {
          return false
        }
      },

      register: async (name, email, password) => {
        try {
          const data = await AuthService.register({ name, email, password })
          set({ isAuthenticated: true, token: data.token, user: data.user })
          return true
        } catch {
          return false
        }
      },

      logout: () => set({ isAuthenticated: false, token: null, user: null }),

      loadUser: async () => {
        const { token } = get()
        if (!token) return
        try {
          const user = await AuthService.me()
          set({ user })
        } catch {
          set({ isAuthenticated: false, token: null, user: null })
        }
      },
    }),
    { name: 'auth-store' },
  ),
)
