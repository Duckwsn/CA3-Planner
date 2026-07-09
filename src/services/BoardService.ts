import { apiGet, apiPost, apiPut, apiDelete } from '../core/api/httpClient'
import type { Board, BoardFormData } from '../types'

export const BoardService = {
  async list(): Promise<Board[]> {
    return apiGet<Board[]>('/boards')
  },

  async getById(id: string): Promise<Board> {
    return apiGet<Board>(`/boards/${id}`)
  },

  async create(data: BoardFormData): Promise<Board> {
    return apiPost<Board>('/boards', data)
  },

  async update(id: string, data: Partial<BoardFormData>): Promise<Board> {
    return apiPut<Board>(`/boards/${id}`, data)
  },

  async remove(id: string): Promise<void> {
    await apiDelete(`/boards/${id}`)
  },
}
