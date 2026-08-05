import type { BadgeProps } from './Badge.types'

const variantClasses: Record<string, string> = {
  default: 'bg-[var(--color-neutral-bg)] text-[var(--gray-600)]',
  success: 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
  warning: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]',
  danger: 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]',
  info: 'bg-[var(--color-info-bg)] text-[var(--color-info)]',
  neutral: 'bg-[var(--color-neutral-bg)] text-[var(--color-neutral)]',
  urgent: 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]',
  high: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]',
  medium: 'bg-[var(--color-info-bg)] text-[var(--color-info)]',
}

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded-[var(--radius-full)]
        text-size-caption font-medium
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  )
}
