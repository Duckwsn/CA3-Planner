const THEME_KEY = 'ca3_theme'
const AUTH_WRAPPER_SELECTOR = '[data-auth-wrapper]'

export type ThemeMode = 'light' | 'dark'

export function getTheme(): ThemeMode {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem(THEME_KEY)
    if (stored === 'dark' || stored === 'light') return stored
  }
  return 'light'
}

export function setTheme(mode: ThemeMode): void {
  window.localStorage.setItem(THEME_KEY, mode)
  applyTheme(mode)
}

export function applyTheme(mode: ThemeMode): void {
  if (typeof document === 'undefined') return
  const el = document.querySelector(AUTH_WRAPPER_SELECTOR)
  if (!el) return
  el.setAttribute('data-theme', mode)
}

export function getAuthTheme(): ThemeMode {
  let mode: ThemeMode | null = null
  try {
    const raw = window.localStorage.getItem('auth-store')
    if (raw) {
      const parsed = JSON.parse(raw)
      const userId = parsed?.state?.user?.id
      if (userId) {
        const storageKey = `ca3_prefs_${userId}`
        const prefsRaw = window.localStorage.getItem(storageKey)
        if (prefsRaw) {
          const prefs = JSON.parse(prefsRaw)
          if (prefs.theme === 'dark' || prefs.theme === 'light') {
            mode = prefs.theme
          }
        }
      }
    }
  } catch {
    // ignore — fallback below
  }
  if (!mode) mode = getTheme()
  return mode
}
