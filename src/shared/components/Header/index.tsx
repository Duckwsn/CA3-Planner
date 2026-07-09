import { LogOut, Menu } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '../Avatar'
import { NotificationsDropdown } from './NotificationsDropdown'
import { useAuthStore } from '../../../stores/core/authStore'
import { useUserStore } from '../../../stores/domain/userStore'
import { useUIStore } from '../../../stores/core/uiStore'
import { loadProfile, type ProfileData } from '../../../utils/profile'
import { getCurrentUserId } from '../../../utils/userPrefs'

export function Header() {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [profile, setProfile] = useState<ProfileData | null>(() => loadProfile(getCurrentUserId() ?? undefined))
  const userMenuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleProfileUpdate(e: Event) {
      const detail = (e as CustomEvent<ProfileData>).detail
      setProfile(detail)
    }
    window.addEventListener('ca3:profile-updated', handleProfileUpdate)
    return () => window.removeEventListener('ca3:profile-updated', handleProfileUpdate)
  }, [])

  const logout = useAuthStore((s) => s.logout)
  const user = useUserStore((s) => s.user)
  const setMobileOpen = useUIStore((s) => s.setMobileOpen)
  const displayName = profile?.name || user?.name || 'Usuário'
  const displayEmail = user?.email ?? ''

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-16 bg-[var(--color-bg-surface)] border-b border-[var(--color-topbar-border)] flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-[var(--radius-md)] text-[var(--gray-500)] hover:bg-[var(--gray-100)] cursor-pointer"
        >
          <Menu size={20} />
        </button>


      </div>

      <div className="flex items-center gap-3">
        <NotificationsDropdown />

        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-[var(--radius-md)] hover:bg-[var(--gray-50)] transition-colors cursor-pointer"
          >
            <Avatar name={displayName} size="sm" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] border border-[var(--gray-200)] py-2 z-[var(--z-dropdown)]">
              <div className="px-4 py-2 border-b border-[var(--gray-200)]">
                <p className="text-size-body-small font-medium text-[var(--gray-900)] truncate">
                  {displayName}
                </p>
                <p className="text-size-caption text-[var(--gray-500)] truncate">
                  {displayEmail}
                </p>
              </div>
              <button
                onClick={() => { navigate('/settings'); setUserMenuOpen(false) }}
                className="w-full text-left px-4 py-2 text-size-body-small text-[var(--gray-700)] hover:bg-[var(--gray-50)] transition-colors cursor-pointer"
              >
                Configurações
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-size-body-small text-[var(--color-danger-600)] hover:bg-[var(--gray-50)] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <LogOut size={14} />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
