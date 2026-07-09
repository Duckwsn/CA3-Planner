import { useEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../../components/Sidebar'
import { Header } from '../../components/Header'
import { getAuthTheme, applyTheme } from '../../../utils/theme'
import { useNotificationPoll } from '../../../hooks'

export function AppLayout() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  useNotificationPoll()

  useEffect(() => {
    const el = wrapperRef.current
    const mode = getAuthTheme()
    if (mode === 'dark') {
      applyTheme('dark')
    }
    return () => {
      el?.removeAttribute('data-theme')
    }
  }, [])

  return (
    <div ref={wrapperRef} data-auth-wrapper className="h-screen flex overflow-hidden bg-[var(--color-bg-page)]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-[1440px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
