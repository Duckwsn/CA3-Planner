import { create } from 'zustand'
import type { ToastData, ToastType } from '../../shared/components/Toast/Toast.types'

interface UIState {
  sidebarCollapsed: boolean
  sidebarMobileOpen: boolean
  activeModal: string | null
  activeDrawer: string | null
  toasts: ToastData[]
  theme: 'light' | 'dark' | 'system'

  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setMobileOpen: (open: boolean) => void
  openModal: (id: string) => void
  closeModal: () => void
  openDrawer: (id: string) => void
  closeDrawer: () => void
  addToast: (type: ToastType, message: string) => void
  removeToast: (id: string) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  activeModal: null,
  activeDrawer: null,
  toasts: [],
  theme: 'light',

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setMobileOpen: (open) => set({ sidebarMobileOpen: open }),

  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
  openDrawer: (id) => set({ activeDrawer: id }),
  closeDrawer: () => set({ activeDrawer: null }),

  addToast: (type, message) => {
    const id = `toast-${Date.now()}`
    set((s) => ({ toasts: [...s.toasts, { id, type, message }] }))
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  setTheme: (theme) => set({ theme }),
}))
