import { forwardRef } from 'react'
import type { ButtonProps } from './Button.types'

const variantClasses: Record<string, string> = {
  primary: 'bg-[var(--color-brand)] text-[var(--color-brand-ink)] hover:bg-[var(--color-brand-hover)] active:bg-[var(--color-brand-bright)] disabled:bg-[var(--gray-300)] disabled:text-[var(--gray-500)]',
  secondary: 'bg-[var(--color-bg-surface)] border border-[var(--color-border-light)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] disabled:bg-[var(--gray-200)] disabled:text-[var(--gray-400)]',
  ghost: 'bg-transparent text-[var(--muted)] hover:text-[var(--color-text-primary)] active:text-[var(--color-text-primary)] disabled:text-[var(--gray-400)]',
  danger: 'bg-[var(--color-danger-bg)] text-[var(--color-danger)] hover:bg-[var(--color-danger-100)] active:opacity-80 disabled:bg-[var(--gray-300)] disabled:text-[var(--gray-500)]',
  success: 'bg-[var(--color-success)] text-white hover:opacity-90 active:opacity-80 disabled:bg-[var(--gray-300)] disabled:text-[var(--gray-500)]',
}

const sizeClasses: Record<string, string> = {
  sm: 'h-8 px-3 text-size-caption rounded-[7px]',
  md: 'h-[38px] px-[18px] text-size-body-small rounded-[9px]',
  lg: 'h-[46px] px-6 text-size-body rounded-[10px]',
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
          inline-flex items-center justify-center gap-2
          font-semibold transition-all duration-[var(--duration-fast)] ease-[var(--easing-default)]
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
