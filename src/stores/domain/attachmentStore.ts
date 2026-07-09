import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AttachmentService } from '../../services/AttachmentService'
import type { Attachment } from '../../types'

interface AttachmentState {
  attachments: Attachment[]
  addAttachment: (formData: FormData) => Promise<void>
  removeAttachment: (id: string) => Promise<void>
  getTaskAttachments: (taskId: string) => Attachment[]
  loadAttachments: (taskId: string) => Promise<void>
}

export const useAttachmentStore = create<AttachmentState>()(
  persist(
    (set, get) => ({
      attachments: [],

      loadAttachments: async (taskId) => {
        try {
          const attachments = await AttachmentService.listByTask(taskId)
          set({ attachments })
        } catch {}
      },

      addAttachment: async (formData) => {
        try {
          const attachment = await AttachmentService.upload(formData)
          set((s) => ({ attachments: [...s.attachments, attachment] }))
        } catch {}
      },

      removeAttachment: async (id) => {
        try {
          await AttachmentService.remove(id)
          set((s) => ({ attachments: s.attachments.filter((a) => a.id !== id) }))
        } catch {}
      },

      getTaskAttachments: (taskId) => get().attachments.filter((a) => a.taskId === taskId),
    }),
    { name: 'attachment-store', partialize: (s) => ({ attachments: s.attachments }) },
  ),
)
