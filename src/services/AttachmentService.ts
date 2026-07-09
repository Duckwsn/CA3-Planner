import { apiGet, apiDelete } from '../core/api/httpClient'
import httpClient from '../core/api/httpClient'
import type { Attachment } from '../types'

export const AttachmentService = {
  async listByTask(taskId: string): Promise<Attachment[]> {
    return apiGet<Attachment[]>(`/attachments/task/${taskId}`)
  },

  async upload(formData: FormData): Promise<Attachment> {
    const { data } = await httpClient.post<Attachment>('/attachments/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async remove(id: string): Promise<void> {
    await apiDelete(`/attachments/${id}`)
  },
}
