import { forwardRef, useId } from 'react'
import type { InputProps } from './Input.types'

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id: externalId, ...props }, ref) => {
    const generatedId = useId()
    const inputId = externalId ?? generatedId

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-size-body-small font-medium text-[var(--gray-700)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full h-11 px-3 rounded-[var(--radius-md)]
            border bg-[var(--color-bg-input)] text-size-body-small text-[var(--gray-900)]
            placeholder:text-[var(--gray-400)]
            transition-colors duration-[var(--duration-fast)]
            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-900)] focus:ring-offset-0
            disabled:bg-[var(--gray-100)] disabled:text-[var(--gray-400)] disabled:cursor-not-allowed
            ${error ? 'border-[var(--color-danger-600)]' : 'border-[var(--gray-300)]'}
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-size-caption text-[var(--color-danger-600)]" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-size-caption text-[var(--gray-400)]">
            {helperText}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
