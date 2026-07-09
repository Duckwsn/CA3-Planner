import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { BoardService } from '../../services/BoardService'
import type { Board, BoardFormData } from '../../types'

interface BoardState {
  boards: Board[]
  loading: boolean
  error: string | null
  selectedBoard: Board | null
  loadBoards: () => Promise<void>
  loadBoard: (id: string) => Promise<void>
  addBoard: (data: BoardFormData) => Promise<void>
  updateBoard: (id: string, data: Partial<BoardFormData>) => Promise<void>
  deleteBoard: (id: string) => Promise<void>
  getBoard: (id: string) => Board | undefined
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      boards: [],
      loading: false,
      error: null,
      selectedBoard: null,

      loadBoards: async () => {
        set({ loading: true, error: null })
        try {
          const boards = await BoardService.list()
          set({ boards, loading: false })
        } catch {
          set({ error: 'Erro ao carregar quadros', loading: false })
        }
      },

      loadBoard: async (id) => {
        set({ loading: true, error: null })
        try {
          const board = await BoardService.getById(id)
          set({ selectedBoard: board, loading: false })
        } catch {
          set({ error: 'Erro ao carregar quadro', loading: false })
        }
      },

      addBoard: async (data) => {
        try {
          const board = await BoardService.create(data)
          set((s) => ({ boards: [board, ...s.boards] }))
        } catch {
          set({ error: 'Erro ao criar quadro' })
        }
      },

      updateBoard: async (id, data) => {
        try {
          const updated = await BoardService.update(id, data)
          set((s) => ({
            boards: s.boards.map((b) => (b.id === id ? updated : b)),
            selectedBoard: s.selectedBoard?.id === id ? updated : s.selectedBoard,
          }))
        } catch {
          set({ error: 'Erro ao atualizar quadro' })
        }
      },

      deleteBoard: async (id) => {
        try {
          await BoardService.remove(id)
          set((s) => ({ boards: s.boards.filter((b) => b.id !== id) }))
        } catch {
          set({ error: 'Erro ao excluir quadro' })
        }
      },

      getBoard: (id) => get().boards.find((b) => b.id === id),
    }),
    { name: 'board-store', partialize: (s) => ({ boards: s.boards }) },
  ),
)
