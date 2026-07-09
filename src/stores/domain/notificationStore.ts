import { create } from 'zustand'
import type { Notification } from '../../types'
import { NotificationService } from '../../services/NotificationService'

interface NotificationState {
  notifications: Notification[]
  loading: boolean
  initialized: boolean
  fetch: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  unreadCount: () => number
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: [],
  loading: false,
  initialized: false,

  fetch: async () => {
    set({ loading: true })
    try {
      const notifications = await NotificationService.list()
      set({ notifications, loading: false, initialized: true })
    } catch {
      set({ loading: false })
    }
  },

  markAsRead: async (id) => {
    set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) }))
    try {
      await NotificationService.markRead(id)
    } catch {}
  },

  markAllAsRead: async () => {
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) }))
    try {
      await NotificationService.markAllRead()
    } catch {}
  },

  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}))
