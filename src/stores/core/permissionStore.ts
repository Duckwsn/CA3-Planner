import { create } from 'zustand'

type PermissionMap = Record<string, boolean>

interface PermissionState {
  permissions: PermissionMap
  setPermissions: (perms: PermissionMap) => void
  can: (permission: string) => boolean
  clear: () => void
}

export const usePermissionStore = create<PermissionState>((set, get) => ({
  permissions: {},

  setPermissions: (permissions) => set({ permissions }),

  can: (permission) => {
    return get().permissions[permission] ?? false
  },

  clear: () => set({ permissions: {} }),
}))
