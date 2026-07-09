import { useEffect, useRef, useCallback } from 'react'
import { X } from 'lucide-react'
import type { DrawerProps } from './Drawer.types'

export function Drawer({ open, onClose, title, children }: DrawerProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
    },
    [],
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
      }
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[var(--z-overlay)]">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => onCloseRef.current()} />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="fixed top-0 right-0 h-full w-[480px] max-w-full bg-[var(--color-bg-modal)] shadow-[var(--shadow-xl)] animate-slide-in-right flex flex-col"
      >
        {title && (
          <div className="flex items-center justify-between h-14 px-6 border-b border-[var(--gray-200)] shrink-0">
            <h2 className="text-size-h6 font-semibold text-[var(--gray-900)]">{title}</h2>
            <button
              onClick={() => onCloseRef.current()}
              className="p-1 rounded-[var(--radius-sm)] text-[var(--gray-400)] hover:text-[var(--gray-600)] hover:bg-[var(--gray-50)] cursor-pointer transition-colors"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  )
}
