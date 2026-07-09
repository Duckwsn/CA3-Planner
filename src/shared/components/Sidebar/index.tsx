import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Columns3,
  Calendar,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import { loadProfile, type ProfileData } from '../../../utils/profile'
import { useAuth } from '../../../hooks/useAuth'
import { useUIStore } from '../../../stores/core/uiStore'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/boards', icon: Columns3, label: 'Quadros' },
  { to: '/calendar', icon: Calendar, label: 'Calendário' },
  { to: '/teams', icon: Users, label: 'Equipes' },
  { to: '/reports', icon: BarChart3, label: 'Relatórios' },
  { to: '/settings', icon: Settings, label: 'Configurações' },
]

function getAvatarColor(name: string) {
  const colors = [
    'var(--color-avatar-1)',
    'var(--color-avatar-2)',
    'var(--color-avatar-3)',
    'var(--color-avatar-logged)',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export function Sidebar() {
  const { user, logout } = useAuth()
  const collapsed = useUIStore((s) => s.sidebarCollapsed)
  const toggle = useUIStore((s) => s.setSidebarCollapsed)

  const [profile, setProfile] = useState<ProfileData | null>(() => loadProfile(user?.id))

  useEffect(() => {
    function handleProfileUpdate(e: Event) {
      const detail = (e as CustomEvent<ProfileData>).detail
      setProfile(detail)
    }
    window.addEventListener('ca3:profile-updated', handleProfileUpdate)
    return () => window.removeEventListener('ca3:profile-updated', handleProfileUpdate)
  }, [])

  const displayName = profile?.name || user?.name || 'Admin'
  const displayEmail = user?.email ?? ''
  const avatarSrc = profile?.avatarUrl || ''
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const avatarColor = getAvatarColor(displayName)

  return (
    <aside
      className={`h-screen bg-[var(--color-sidebar-bg)] flex flex-col shrink-0 overflow-hidden transition-all duration-[var(--duration-normal)] relative ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-sidebar-logo-bg)] shrink-0">
            <span className="text-[var(--color-sidebar-item-active-text)] font-extrabold text-sm">CA3</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-size-body-small font-bold text-white truncate leading-tight">CA3 Planner</span>
              <span className="text-size-caption text-white/60 truncate leading-tight">Pedagógico</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] transition-colors duration-[var(--duration-fast)] ${
                isActive
                  ? 'bg-[var(--color-sidebar-item-active-bg)] text-[var(--color-sidebar-item-active-text)] font-semibold'
                  : 'text-[var(--color-sidebar-item-inactive)] hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <item.icon size={20} className="shrink-0" />
            {!collapsed && <span className="text-size-body-small truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User area */}
      <div className="px-3 pt-4 shrink-0 border-t border-white/10">
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] ${collapsed ? 'justify-center' : ''}`}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-size-caption font-bold shrink-0 overflow-hidden"
            style={{ backgroundColor: avatarSrc ? 'transparent' : avatarColor }}
          >
            {avatarSrc ? (
              <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-size-body-small text-[var(--sidebar-item-text,var(--color-sidebar-item-inactive))] font-medium truncate">{displayName}</p>
              <p className="text-size-caption text-[var(--sidebar-item-text,var(--color-sidebar-item-inactive))] opacity-60 truncate">{displayEmail}</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 mt-1 rounded-[var(--radius-md)] text-[var(--sidebar-item-text,var(--color-sidebar-item-inactive))] hover:bg-white/10 hover:text-white transition-colors text-size-body-small cursor-pointer"
          >
            <LogOut size={20} className="shrink-0" />
            <span className="truncate">Sair</span>
          </button>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => toggle(!collapsed)}
        className="flex items-center justify-start gap-3 w-full h-12 px-5 shrink-0 border-t border-white/10 text-[var(--sidebar-item-text,var(--color-sidebar-item-inactive))] hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
      >
        {collapsed ? (
          <ChevronRight size={18} className="mx-auto" />
        ) : (
          <>
            <ChevronLeft size={18} />
            <span className="text-[14px] font-medium">Recolher</span>
          </>
        )}
      </button>
    </aside>
  )
}
