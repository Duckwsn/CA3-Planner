import type { ThemeMode } from './theme'

export interface UserPreferences {
  theme: ThemeMode
  language: string
  dateFormat: string
  notifications: Record<string, boolean>
}

const NOTIF_DEFAULTS: Record<string, boolean> = {
  ca3_notif_tarefas_atrasadas: true,
  ca3_notif_novas_tarefas: true,
  ca3_notif_comentarios: true,
  ca3_notif_resumo_semanal: true,
}

export function getCurrentUserId(): string | null {
  try {
    const raw = window.localStorage.getItem('auth-store')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.state?.user?.id ?? null
  } catch {
    return null
  }
}

function storageKey(userId: string): string {
  return `ca3_prefs_${userId}`
}

export function loadUserPrefs(userId: string): UserPreferences {
  try {
    const raw = window.localStorage.getItem(storageKey(userId))
    if (raw) return JSON.parse(raw) as UserPreferences
  } catch {
    // ignore
  }
  return getDefaultPrefs()
}

export function saveUserPrefs(userId: string, prefs: UserPreferences): void {
  window.localStorage.setItem(storageKey(userId), JSON.stringify(prefs))
}

export function getDefaultPrefs(): UserPreferences {
  return {
    theme: 'light',
    language: 'pt',
    dateFormat: 'dd/mm/aaaa',
    notifications: { ...NOTIF_DEFAULTS },
  }
}

export function loadUserPrefsOrGlobal(): UserPreferences {
  const userId = getCurrentUserId()
  if (userId) return loadUserPrefs(userId)
  return getDefaultPrefs()
}

export function saveTheme(userId: string, mode: ThemeMode): void {
  const prefs = loadUserPrefs(userId)
  prefs.theme = mode
  saveUserPrefs(userId, prefs)
}

export function saveLanguage(userId: string, lang: string): void {
  const prefs = loadUserPrefs(userId)
  prefs.language = lang
  saveUserPrefs(userId, prefs)
}

export function saveDateFormat(userId: string, fmt: string): void {
  const prefs = loadUserPrefs(userId)
  prefs.dateFormat = fmt
  saveUserPrefs(userId, prefs)
}

export function saveNotificationPref(userId: string, key: string, value: boolean): void {
  const prefs = loadUserPrefs(userId)
  prefs.notifications[key] = value
  saveUserPrefs(userId, prefs)
}
