import { apiGet, apiPost, apiPatch, apiDelete } from '../core/api/httpClient'
import type { ChecklistItem } from '../types'

export const ChecklistService = {
  async listByTask(taskId: string): Promise<ChecklistItem[]> {
    return apiGet<ChecklistItem[]>(`/checklist/task/${taskId}`)
  },

  async create(data: { taskId: string; text: string }): Promise<ChecklistItem> {
    return apiPost<ChecklistItem>('/checklist', data)
  },

  async toggle(id: string): Promise<ChecklistItem> {
    return apiPatch<ChecklistItem>(`/checklist/${id}/toggle`)
  },

  async remove(id: string): Promise<void> {
    await apiDelete(`/checklist/${id}`)
  },
}
