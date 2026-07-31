import { apiGet, apiPost, apiPut, apiDelete } from '../core/api/httpClient'
import type { Team, TeamMember, User } from '../types'

export const TeamService = {
  async list(): Promise<Team[]> {
    return apiGet<Team[]>('/teams')
  },

  async create(data: { name: string; description?: string }): Promise<Team> {
    return apiPost<Team>('/teams', data)
  },

  async update(id: string, data: { name?: string; description?: string }): Promise<Team> {
    return apiPut<Team>(`/teams/${id}`, data)
  },

  async remove(id: string): Promise<void> {
    await apiDelete(`/teams/${id}`)
  },

  async addMember(teamId: string, data: { userId: string }): Promise<TeamMember> {
    return apiPost<TeamMember>(`/teams/${teamId}/members`, data)
  },

  async removeMember(teamId: string, memberId: string): Promise<void> {
    await apiDelete(`/teams/${teamId}/members/${memberId}`)
  },

  async listUsers(): Promise<User[]> {
    return apiGet<User[]>('/users')
  },

  async listAssignableMembers(): Promise<string[]> {
    return apiGet<string[]>('/teams/assignable-members')
  },
}
