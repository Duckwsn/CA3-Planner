import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '../core/api/httpClient'
import type { Task, TaskFormData } from '../types'

export const TaskService = {
  async listAll(): Promise<Task[]> {
    return apiGet<Task[]>('/tasks')
  },

  async listByBoard(boardId: string): Promise<Task[]> {
    return apiGet<Task[]>(`/tasks/board/${boardId}`)
  },

  async create(data: TaskFormData & { boardId: string }): Promise<Task> {
    return apiPost<Task>('/tasks', data)
  },

  async update(id: string, data: Partial<TaskFormData>): Promise<Task> {
    return apiPut<Task>(`/tasks/${id}`, data)
  },

  async move(id: string, status: string): Promise<Task> {
    return apiPatch<Task>(`/tasks/${id}/move`, { status })
  },

  async remove(id: string): Promise<void> {
    await apiDelete(`/tasks/${id}`)
  },
}
