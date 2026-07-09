import { useAuthStore } from '../../stores/core/authStore'
import { useUIStore } from '../../stores/core/uiStore'

export function useLoginController() {
  const login = useAuthStore((s) => s.login)
  const addToast = useUIStore((s) => s.addToast)

  async function handleLogin(email: string, password: string): Promise<boolean> {
    const success = await login(email, password)
    if (success) {
      addToast('success', 'Login realizado com sucesso')
      return true
    }
    addToast('error', 'Credenciais inválidas')
    return false
  }

  return { handleLogin }
}
