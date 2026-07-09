import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TaskService } from '../../services/TaskService'
import type { Task, TaskFormData, TaskStatus } from '../../types'

interface TaskState {
  tasks: Task[]
  loading: boolean
  error: string | null
  selectedTask: Task | null
  loadTasks: (boardId: string) => Promise<void>
  loadAllTasks: () => Promise<void>
  addTask: (data: TaskFormData & { boardId: string }) => Promise<void>
  updateTask: (id: string, data: Partial<TaskFormData>) => Promise<void>
  moveTask: (id: string, status: TaskStatus) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  getBoardTasks: (boardId: string) => Task[]
  setSelectedTask: (task: Task | null) => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      loading: false,
      error: null,
      selectedTask: null,

  loadTasks: async (boardId) => {
    set({ loading: true, error: null })
    try {
      const tasks = await TaskService.listByBoard(boardId)
      set({ tasks, loading: false })
    } catch {
      set({ error: 'Erro ao carregar tarefas', loading: false })
    }
  },

  loadAllTasks: async () => {
    set({ loading: true, error: null })
    try {
      const tasks = await TaskService.listAll()
      set({ tasks, loading: false })
    } catch {
      set({ error: 'Erro ao carregar tarefas', loading: false })
    }
  },

      addTask: async (data) => {
        try {
          const task = await TaskService.create(data)
          set((s) => ({ tasks: [...s.tasks, task] }))
        } catch {
          set({ error: 'Erro ao criar tarefa' })
        }
      },

      updateTask: async (id, data) => {
        try {
          const updated = await TaskService.update(id, data)
          set((s) => ({
            tasks: s.tasks.map((t) => (t.id === id ? updated : t)),
            selectedTask: s.selectedTask?.id === id ? updated : s.selectedTask,
          }))
        } catch {
          set({ error: 'Erro ao atualizar tarefa' })
        }
      },

      moveTask: async (id, status) => {
        try {
          const updated = await TaskService.move(id, status)
          set((s) => ({
            tasks: s.tasks.map((t) => (t.id === id ? updated : t)),
          }))
        } catch {
          set({ error: 'Erro ao mover tarefa' })
        }
      },

      deleteTask: async (id) => {
        try {
          await TaskService.remove(id)
          set((s) => ({
            tasks: s.tasks.filter((t) => t.id !== id),
            selectedTask: s.selectedTask?.id === id ? null : s.selectedTask,
          }))
        } catch {
          set({ error: 'Erro ao excluir tarefa' })
        }
      },

      getBoardTasks: (boardId) => get().tasks.filter((t) => t.boardId === boardId),

      setSelectedTask: (task) => set({ selectedTask: task }),
    }),
    { name: 'task-store', partialize: (s) => ({ tasks: s.tasks }) },
  ),
)
