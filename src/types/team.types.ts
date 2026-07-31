export interface TeamMember {
  id: string
  teamId?: string
  userId?: string | null
  name: string
  email: string
  role: string
  user?: {
    id: string
    name: string
    email: string
    role: string
    avatar: string
  } | null
}

export interface Team {
  id: string
  name: string
  description: string
  members: TeamMember[]
  createdAt: string
  updatedAt: string
}
