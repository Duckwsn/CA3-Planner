import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ChecklistService } from '../../services/ChecklistService'
import type { ChecklistItem } from '../../types'

interface ChecklistState {
  items: ChecklistItem[]
  addItem: (data: { taskId: string; text: string }) => Promise<void>
  toggleItem: (id: string) => Promise<void>
  removeItem: (id: string) => Promise<void>
  getTaskItems: (taskId: string) => ChecklistItem[]
  loadItems: (taskId: string) => Promise<void>
}

export const useChecklistStore = create<ChecklistState>()(
  persist(
    (set, get) => ({
      items: [],

      loadItems: async (taskId) => {
        try {
          const items = await ChecklistService.listByTask(taskId)
          set({ items })
        } catch {}
      },

      addItem: async (data) => {
        try {
          const item = await ChecklistService.create(data)
          set((s) => ({ items: [...s.items, item] }))
        } catch {}
      },

      toggleItem: async (id) => {
        try {
          const updated = await ChecklistService.toggle(id)
          set((s) => ({
            items: s.items.map((i) => (i.id === id ? updated : i)),
          }))
        } catch {}
      },

      removeItem: async (id) => {
        try {
          await ChecklistService.remove(id)
          set((s) => ({ items: s.items.filter((i) => i.id !== id) }))
        } catch {}
      },

      getTaskItems: (taskId) => get().items.filter((i) => i.taskId === taskId),
    }),
    { name: 'checklist-store', partialize: (s) => ({ items: s.items }) },
  ),
)
