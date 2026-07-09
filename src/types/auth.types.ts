export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  organizationId: string
}

export interface LoginDTO {
  email: string
  password: string
}

export interface RegisterDTO {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}
