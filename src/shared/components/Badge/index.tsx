import type { BadgeProps } from './Badge.types'

const variantClasses: Record<string, string> = {
  default: 'bg-[var(--color-bg-subtle)] text-[var(--muted)]',
  success: 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
  warning: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]',
  danger: 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]',
  info: 'bg-[var(--color-info-bg)] text-[var(--color-info)]',
  neutral: 'bg-[var(--color-bg-subtle)] text-[var(--muted)]',
  urgent: 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]',
  high: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]',
  medium: 'bg-[var(--color-info-bg)] text-[var(--color-info)]',
}

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-[10px] py-[3px] rounded-[var(--radius-full)]
        text-[11.5px] font-semibold whitespace-nowrap
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  )
}
