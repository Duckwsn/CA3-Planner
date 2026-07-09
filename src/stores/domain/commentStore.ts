import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CommentService } from '../../services/CommentService'
import type { Comment } from '../../types'

interface CommentState {
  comments: Comment[]
  loading: boolean
  addComment: (data: { taskId: string; content: string }) => Promise<void>
  getTaskComments: (taskId: string) => Comment[]
  loadComments: (taskId: string) => Promise<void>
}

export const useCommentStore = create<CommentState>()(
  persist(
    (set, get) => ({
      comments: [],
      loading: false,

      loadComments: async (taskId) => {
        set({ loading: true })
        try {
          const comments = await CommentService.listByTask(taskId)
          set({ comments, loading: false })
        } catch {
          set({ loading: false })
        }
      },

      addComment: async (data) => {
        try {
          const comment = await CommentService.create(data)
          set((s) => ({ comments: [...s.comments, comment] }))
        } catch {}
      },

      getTaskComments: (taskId) => get().comments.filter((c) => c.taskId === taskId),
    }),
    { name: 'comment-store', partialize: (s) => ({ comments: s.comments }) },
  ),
)
