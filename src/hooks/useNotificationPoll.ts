import { useEffect, useRef } from 'react'
import { useNotificationStore } from '../stores/domain/notificationStore'
import { useAuthStore } from '../stores/core/authStore'

const POLL_INTERVAL = 30000

export function useNotificationPoll() {
  const fetch = useNotificationStore((s) => s.fetch)
  const initialized = useNotificationStore((s) => s.initialized)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!isAuthenticated) return

    if (!initialized) fetch()

    intervalRef.current = setInterval(fetch, POLL_INTERVAL)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isAuthenticated])
}
