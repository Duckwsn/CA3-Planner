import { useAuthStore } from '../../stores/core/authStore'
import { useUIStore } from '../../stores/core/uiStore'

export function useRegisterController() {
  const register = useAuthStore((s) => s.register)
  const addToast = useUIStore((s) => s.addToast)

  async function handleRegister(name: string, email: string, password: string): Promise<boolean> {
    const success = await register(name, email, password)
    if (success) {
      addToast('success', 'Conta criada com sucesso')
      return true
    }
    addToast('error', 'Erro ao criar conta. Verifique os dados e tente novamente.')
    return false
  }

  return { handleRegister }
}
