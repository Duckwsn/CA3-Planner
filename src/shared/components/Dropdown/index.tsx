import { useState, useRef, useEffect } from 'react'
import type { DropdownProps } from './Dropdown.types'

export function Dropdown({ trigger, items, align = 'right', className = '' }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className={`relative inline-flex ${className}`}>
      <button onClick={() => setOpen(!open)} className="cursor-pointer" type="button">
        {trigger}
      </button>

      {open && (
        <div
          className={`
            absolute top-full mt-2 min-w-[200px] bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)]
            shadow-[var(--shadow-lg)] border border-[var(--gray-200)] py-2 z-[var(--z-dropdown)]
            animate-fade-in
            ${align === 'right' ? 'right-0' : 'left-0'}
          `}
        >
          {items.map((item, idx) => (
            <div key={idx}>
              {item.divider && <div className="my-1 border-t border-[var(--gray-200)]" />}
              <button
                onClick={() => { item.onClick(); setOpen(false) }}
                disabled={item.disabled}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 text-size-body-small transition-colors cursor-pointer
                  ${item.disabled ? 'text-[var(--gray-400)] cursor-not-allowed' : ''}
                  ${item.danger ? 'text-[var(--color-danger-600)] hover:bg-[var(--color-danger-50)]' : 'text-[var(--gray-700)] hover:bg-[var(--gray-50)]'}
                `}
              >
                {item.icon && <span className="shrink-0 w-4 flex justify-center">{item.icon}</span>}
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
