import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, CheckCheck, AlertTriangle, CheckCircle, Info, CalendarClock, UserPlus, MessageSquare } from 'lucide-react'
import { useNotificationStore } from '../../../stores/domain/notificationStore'

const typeIcons: Record<string, typeof Bell> = {
  task_created: CheckCircle,
  task_moved: Info,
  task_due: CalendarClock,
  task_overdue: AlertTriangle,
  member_added: UserPlus,
  comment_created: MessageSquare,
}

const typeColors: Record<string, string> = {
  task_created: 'text-[var(--color-success-600)] bg-[var(--color-success-100)]',
  task_moved: 'text-[var(--color-info-600)] bg-[var(--color-info-100)]',
  task_due: 'text-[var(--color-warning-600)] bg-[var(--color-warning-100)]',
  task_overdue: 'text-[var(--color-danger-600)] bg-[var(--color-danger-100)]',
  member_added: 'text-[var(--color-primary-600)] bg-[var(--color-primary-100)]',
  comment_created: 'text-[var(--color-secondary-600)] bg-[var(--color-secondary-100)]',
}

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const notifications = useNotificationStore((s) => s.notifications)
  const markAsRead = useNotificationStore((s) => s.markAsRead)
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead)
  const unreadCount = useNotificationStore((s) => s.unreadCount)

  function handleClick(n: { id: string; link: string; read: boolean }) {
    if (!n.read) markAsRead(n.id)
    if (n.link) navigate(n.link)
    setOpen(false)
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-[var(--radius-md)] text-[var(--gray-400)] hover:text-[var(--gray-600)] hover:bg-[var(--gray-50)] transition-colors cursor-pointer"
        aria-label="Notificações"
      >
        <Bell size={20} />
        {unreadCount() > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-[var(--radius-full)] bg-[var(--color-danger-600)] text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount() > 9 ? '9+' : unreadCount()}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] border border-[var(--color-border-light)] z-[var(--z-dropdown)]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--gray-200)]">
            <h3 className="text-size-body-small font-semibold text-[var(--gray-900)]">Notificações</h3>
            {unreadCount() > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-size-caption text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck size={14} />
                Marcar todas
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={24} className="mx-auto mb-2 text-[var(--gray-300)]" />
                <p className="text-size-body-small text-[var(--gray-500)]">Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = typeIcons[n.type] ?? Bell
                const colorClass = typeColors[n.type] ?? 'text-[var(--gray-500)] bg-[var(--gray-100)]'
                return (
                  <button
                    key={n.id}
                    onClick={() => handleClick(n)}
                    className={`w-full text-left px-4 py-3 flex gap-3 hover:bg-[var(--gray-50)] transition-colors cursor-pointer ${!n.read ? 'bg-[var(--color-primary-50)]' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center shrink-0 ${colorClass}`}>
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-size-body-small font-medium text-[var(--gray-900)] truncate">{n.title}</p>
                      <p className="text-size-caption text-[var(--gray-500)] truncate">{n.message}</p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
