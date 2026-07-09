import { forwardRef } from 'react'
import type { ButtonProps } from './Button.types'

const variantClasses: Record<string, string> = {
  primary: 'bg-[var(--color-primary-900)] text-white hover:bg-[var(--color-primary-800)] active:bg-[var(--color-primary-700)] disabled:bg-[var(--gray-300)] disabled:text-[var(--gray-500)]',
  secondary: 'bg-[var(--color-gold-500)] text-[var(--color-primary-900)] hover:bg-[var(--color-gold-600)] active:bg-[var(--color-gold-700)] disabled:bg-[var(--gray-300)] disabled:text-[var(--gray-500)]',
  ghost: 'bg-transparent text-[var(--color-primary-900)] hover:bg-[var(--gray-100)] active:bg-[var(--gray-200)] disabled:text-[var(--gray-400)]',
  danger: 'bg-[var(--color-danger-600)] text-white hover:bg-[var(--color-danger-700)] active:bg-[var(--color-danger-800)] disabled:bg-[var(--gray-300)] disabled:text-[var(--gray-500)]',
  success: 'bg-[var(--color-success-600)] text-white hover:bg-[var(--color-success-700)] active:bg-[var(--color-success-800)] disabled:bg-[var(--gray-300)] disabled:text-[var(--gray-500)]',
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
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-900)] focus-visible:ring-offset-2
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
