import { useEffect, useRef, useCallback } from 'react'
import { X } from 'lucide-react'
import type { ModalProps } from './Modal.types'

const sizeClasses: Record<string, string> = {
  sm: 'max-w-[480px]',
  md: 'max-w-[640px]',
  lg: 'max-w-[840px]',
}

export function Modal({ open, onClose, title, size = 'md', children, footer }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
      if (e.key === 'Tab' && contentRef.current) {
        const focusable = contentRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    },
    [],
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
      const timer = setTimeout(() => contentRef.current?.focus(), 50)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
        clearTimeout(timer)
      }
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[var(--z-overlay)] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onCloseRef.current() }}
    >
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`
          relative w-full ${sizeClasses[size]} bg-[var(--color-bg-modal)]
          rounded-[var(--radius-xl)] shadow-[var(--shadow-xl)]
          animate-scale-up outline-none
        `}
      >
        {title && (
          <div className="flex items-center justify-between h-14 px-6 border-b border-[var(--gray-200)]">
            <h2 className="text-size-h6 font-semibold text-[var(--gray-900)]">{title}</h2>
            <button
              onClick={() => onCloseRef.current()}
              className="p-1 rounded-[var(--radius-sm)] text-[var(--gray-400)] hover:text-[var(--gray-600)] hover:bg-[var(--gray-100)] cursor-pointer transition-colors"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--gray-200)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
