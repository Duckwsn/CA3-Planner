import { useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import type { ToastProps } from './Toast.types'

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const bgClasses: Record<string, string> = {
  success: 'bg-[var(--color-success-600)]',
  error: 'bg-[var(--color-danger-600)]',
  warning: 'bg-[var(--color-warning-600)]',
  info: 'bg-[var(--color-info-600)]',
}

export function ToastItem({ toast, onDismiss }: ToastProps) {
  const Icon = icons[toast.type]

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)]
        text-white text-size-body-small font-medium
        shadow-[var(--shadow-lg)] animate-slide-in-right
        ${bgClasses[toast.type]}
      `}
      role="alert"
    >
      <Icon size={18} className="shrink-0" />
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-0.5 rounded hover:bg-[var(--gray-200)] cursor-pointer transition-colors"
        aria-label="Fechar"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: { id: string; type: string; message: string }[]
  onDismiss: (id: string) => void
}) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[var(--z-toast)] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t as any} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
