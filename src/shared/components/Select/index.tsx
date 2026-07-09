import { forwardRef, useId } from 'react'
import { ChevronDown } from 'lucide-react'
import type { SelectProps } from './Select.types'

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, placeholder, className = '', id: externalId, ...props }, ref) => {
    const generatedId = useId()
    const selectId = externalId ?? generatedId

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-size-body-small font-medium text-[var(--gray-700)]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`
              w-full h-11 pl-3 pr-10 rounded-[var(--radius-md)]
              border bg-[var(--color-bg-input)] text-size-body-small text-[var(--gray-900)]
              appearance-none cursor-pointer
              transition-colors duration-[var(--duration-fast)]
              focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-900)] focus:ring-offset-0
              disabled:bg-[var(--gray-100)] disabled:text-[var(--gray-400)] disabled:cursor-not-allowed
              ${error ? 'border-[var(--color-danger-600)]' : 'border-[var(--gray-300)]'}
              ${className}
            `}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--gray-400)] pointer-events-none" />
        </div>
        {error && (
          <p id={`${selectId}-error`} className="text-size-caption text-[var(--color-danger-600)]" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${selectId}-helper`} className="text-size-caption text-[var(--gray-400)]">{helperText}</p>
        )}
      </div>
    )
  },
)

Select.displayName = 'Select'
