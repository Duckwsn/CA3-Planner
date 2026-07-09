import { apiGet, apiPatch, apiPost } from '../core/api/httpClient'
import type { Notification } from '../types'

export const NotificationService = {
  async list(): Promise<Notification[]> {
    return apiGet<Notification[]>('/notifications')
  },

  async unreadCount(): Promise<{ count: number }> {
    return apiGet<{ count: number }>('/notifications/unread-count')
  },

  async markRead(id: string): Promise<void> {
    await apiPatch(`/notifications/${id}/read`)
  },

  async markAllRead(): Promise<void> {
    await apiPost('/notifications/read-all')
  },
}
