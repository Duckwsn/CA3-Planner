import { apiPost, apiGet, apiPatch } from '../core/api/httpClient'
import type { AuthResponse, LoginDTO, RegisterDTO, User } from '../types'

export const AuthService = {
  async login(data: LoginDTO): Promise<AuthResponse> {
    return apiPost<AuthResponse>('/auth/login', data)
  },

  async register(data: RegisterDTO): Promise<AuthResponse> {
    return apiPost<AuthResponse>('/auth/register', data)
  },

  async me(): Promise<User> {
    return apiGet<User>('/auth/me')
  },

  async changePassword(senhaAtual: string, novaSenha: string): Promise<{ mensagem: string }> {
    return apiPatch<{ mensagem: string }>('/auth/me/password', { senhaAtual, novaSenha })
  },
}
