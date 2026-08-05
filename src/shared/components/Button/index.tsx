import { forwardRef } from 'react'
import type { ButtonProps } from './Button.types'

const variantClasses: Record<string, string> = {
  primary: 'bg-[var(--scale-primary-950)] text-white hover:bg-[var(--scale-primary-900)] active:bg-[var(--scale-primary-800)] disabled:bg-[var(--gray-300)] disabled:text-[var(--gray-500)]',
  secondary: 'bg-[var(--color-brand)] text-[var(--color-brand-ink)] hover:bg-[var(--color-brand-hover)] active:bg-[var(--color-brand-bright)] disabled:bg-[var(--gray-300)] disabled:text-[var(--gray-500)]',
  ghost: 'bg-transparent text-[var(--scale-primary-900)] hover:bg-[var(--gray-100)] active:bg-[var(--gray-200)] disabled:text-[var(--gray-400)]',
  danger: 'bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger)] hover:opacity-90 active:opacity-80 disabled:bg-[var(--gray-300)] disabled:text-[var(--gray-500)]',
  success: 'bg-[var(--color-success)] text-white hover:opacity-90 active:opacity-80 disabled:bg-[var(--gray-300)] disabled:text-[var(--gray-500)]',
}

const sizeClasses: Record<string, string> = {
  sm: 'h-8 px-3 text-size-caption',
  md: 'h-11 px-4 text-size-body-small',
  lg: 'h-13 px-6 text-size-body',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      iconLeft,
      iconRight,
      fullWidth = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)]
          font-medium transition-all duration-[var(--duration-fast)] ease-[var(--easing-default)]
          cursor-pointer disabled:cursor-not-allowed
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : iconLeft ? (
          <span className="shrink-0">{iconLeft}</span>
        ) : null}
        {children && <span>{children}</span>}
        {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
      </button>
    )
  },
)

Button.displayName = 'Button'
