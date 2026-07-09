import { forwardRef, useId } from 'react'
import type { TextareaProps } from './Textarea.types'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id: externalId, ...props }, ref) => {
    const generatedId = useId()
    const textareaId = externalId ?? generatedId

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-size-body-small font-medium text-[var(--gray-700)]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full min-h-[100px] px-3 py-2.5 rounded-[var(--radius-md)]
            border bg-[var(--color-bg-input)] text-size-body-small text-[var(--gray-900)]
            placeholder:text-[var(--gray-400)] resize-y
            transition-colors duration-[var(--duration-fast)]
            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-900)] focus:ring-offset-0
            disabled:bg-[var(--gray-100)] disabled:text-[var(--gray-400)] disabled:cursor-not-allowed
            ${error ? 'border-[var(--color-danger-600)]' : 'border-[var(--gray-300)]'}
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="text-size-caption text-[var(--color-danger-600)]" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${textareaId}-helper`} className="text-size-caption text-[var(--gray-400)]">{helperText}</p>
        )}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
