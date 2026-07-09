import { apiGet, apiPost } from '../core/api/httpClient'
import type { Comment } from '../types'

export const CommentService = {
  async listByTask(taskId: string): Promise<Comment[]> {
    return apiGet<Comment[]>(`/comments/task/${taskId}`)
  },

  async create(data: { taskId: string; content: string }): Promise<Comment> {
    return apiPost<Comment>('/comments', data)
  },
}
