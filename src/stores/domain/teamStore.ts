import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TeamService } from '../../services/TeamService'
import type { Team } from '../../types'

interface TeamState {
  teams: Team[]
  loading: boolean
  error: string | null
  loadTeams: () => Promise<void>
  addTeam: (data: { name: string; description?: string }) => Promise<void>
  updateTeam: (id: string, data: { name?: string; description?: string }) => Promise<void>
  deleteTeam: (id: string) => Promise<void>
  addMember: (teamId: string, data: { name: string; email?: string; role?: string }) => Promise<void>
  removeMember: (teamId: string, memberId: string) => Promise<void>
}

export const useTeamStore = create<TeamState>()(
  persist(
    (set) => ({
      teams: [],
      loading: false,
      error: null,

      loadTeams: async () => {
        set({ loading: true, error: null })
        try {
          const teams = await TeamService.list()
          set({ teams, loading: false })
        } catch {
          set({ error: 'Erro ao carregar equipes', loading: false })
        }
      },

      addTeam: async (data) => {
        try {
          const team = await TeamService.create(data)
          set((s) => ({ teams: [...s.teams, team] }))
        } catch {
          set({ error: 'Erro ao criar equipe' })
        }
      },

      updateTeam: async (id, data) => {
        try {
          const updated = await TeamService.update(id, data)
          set((s) => ({ teams: s.teams.map((t) => (t.id === id ? updated : t)) }))
        } catch {
          set({ error: 'Erro ao atualizar equipe' })
        }
      },

      deleteTeam: async (id) => {
        try {
          await TeamService.remove(id)
          set((s) => ({ teams: s.teams.filter((t) => t.id !== id) }))
        } catch {
          set({ error: 'Erro ao excluir equipe' })
        }
      },

      addMember: async (teamId, data) => {
        try {
          const member = await TeamService.addMember(teamId, data)
          set((s) => ({
            teams: s.teams.map((t) =>
              t.id === teamId ? { ...t, members: [...t.members, member] } : t,
            ),
          }))
        } catch {
          set({ error: 'Erro ao adicionar membro' })
        }
      },

      removeMember: async (teamId, memberId) => {
        try {
          await TeamService.removeMember(teamId, memberId)
          set((s) => ({
            teams: s.teams.map((t) =>
              t.id === teamId
                ? { ...t, members: t.members.filter((m) => m.id !== memberId) }
                : t,
            ),
          }))
        } catch {
          set({ error: 'Erro ao remover membro' })
        }
      },
    }),
    { name: 'team-store', partialize: (s) => ({ teams: s.teams }) },
  ),
)
