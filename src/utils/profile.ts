export interface ProfileData {
  name: string
  cargo: string
  avatarUrl: string
}

const GLOBAL_KEY = 'ca3_user_profile'

function profileKey(userId?: string): string {
  return userId ? `${GLOBAL_KEY}_${userId}` : GLOBAL_KEY
}

export function loadProfile(userId?: string): ProfileData | null {
  try {
    const raw = window.localStorage.getItem(profileKey(userId))
    return raw ? (JSON.parse(raw) as ProfileData) : null
  } catch {
    return null
  }
}

export function saveProfile(data: ProfileData, userId?: string): void {
  window.localStorage.setItem(profileKey(userId), JSON.stringify(data))
  window.dispatchEvent(new CustomEvent('ca3:profile-updated', { detail: data }))
}

const NOTIF_PREFIX = 'ca3_notif_'

export const NOTIF_KEYS = {
  overdue: `${NOTIF_PREFIX}tarefas_atrasadas`,
  assigned: `${NOTIF_PREFIX}novas_tarefas`,
  comments: `${NOTIF_PREFIX}comentarios`,
  weekly: `${NOTIF_PREFIX}resumo_semanal`,
} as const

export function loadNotificationPrefs(): Record<string, boolean> {
  const prefs: Record<string, boolean> = {}
  for (const [, key] of Object.entries(NOTIF_KEYS)) {
    const stored = window.localStorage.getItem(key)
    prefs[key] = stored !== null ? stored === 'true' : true
  }
  return prefs
}

export function saveNotificationPref(key: string, value: boolean): void {
  window.localStorage.setItem(key, String(value))
}

export const LANGUAGE_KEY = 'ca3_language'

export function getLanguage(): string {
  return window.localStorage.getItem(LANGUAGE_KEY) || 'pt'
}

export function setLanguage(lang: string): void {
  window.localStorage.setItem(LANGUAGE_KEY, lang)
}
