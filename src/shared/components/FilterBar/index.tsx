import { X } from 'lucide-react'
import type { FilterBarProps } from './FilterBar.types'

export function FilterBar({ chips, onToggle, onClear, children, className = '' }: FilterBarProps) {
  const hasActive = chips.some((c) => c.active)

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {children}
      {chips.map((chip) => (
        <button
          key={chip.id}
          onClick={() => onToggle(chip.id)}
          className={`
            inline-flex items-center gap-1.5 h-8 px-3 rounded-[var(--radius-full)]
            text-size-caption font-medium transition-colors cursor-pointer
            ${chip.active
              ? 'bg-[var(--color-primary-900)] text-white'
              : 'bg-[var(--gray-100)] text-[var(--gray-600)] hover:bg-[var(--gray-200)]'
            }
          `}
        >
          {chip.label}
          {chip.active && <X size={12} />}
        </button>
      ))}
      {hasActive && (
        <button
          onClick={onClear}
          className="text-size-caption text-[var(--gray-400)] hover:text-[var(--gray-600)] transition-colors cursor-pointer"
        >
          Limpar
        </button>
      )}
    </div>
  )
}
