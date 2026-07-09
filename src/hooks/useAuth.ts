import { useAuthStore } from '../stores/core/authStore'

export function useAuth() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)
  const login = useAuthStore((s) => s.login)
  const register = useAuthStore((s) => s.register)
  const logout = useAuthStore((s) => s.logout)
  const loadUser = useAuthStore((s) => s.loadUser)

  return { isAuthenticated, user, login, register, logout, loadUser }
}
