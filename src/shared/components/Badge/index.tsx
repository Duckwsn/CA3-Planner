import type { BadgeProps } from './Badge.types'

const variantClasses: Record<string, string> = {
  default: 'bg-[var(--gray-100)] text-[var(--gray-700)]',
  success: 'bg-[var(--color-success-100)] text-[var(--color-success-700)]',
  warning: 'bg-[var(--color-warning-100)] text-[var(--color-warning-700)]',
  danger: 'bg-[var(--color-danger-100)] text-[var(--color-danger-700)]',
  info: 'bg-[var(--color-info-100)] text-[var(--color-info-700)]',
  neutral: 'bg-[var(--gray-200)] text-[var(--gray-600)]',
  urgent: 'bg-[var(--color-badge-urgent-bg)] text-[var(--color-badge-urgent-text)]',
  high: 'bg-[var(--color-badge-high-bg)] text-[var(--color-badge-high-text)]',
  medium: 'bg-[var(--color-badge-medium-bg)] text-[var(--color-badge-medium-text)]',
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
