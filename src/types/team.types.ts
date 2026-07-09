export interface TeamMember {
  id: string
  teamId?: string
  name: string
  email: string
  role: string
}

export interface Team {
  id: string
  name: string
  description: string
  members: TeamMember[]
  createdAt: string
  updatedAt: string
}
