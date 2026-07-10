import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title?: string
  description?: string
  action?: ReactNode
  message?: string
}

export function EmptyState({ icon, title, description, action, message }: EmptyStateProps) {
  const heading = title ?? message
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && <div className="mb-4 text-[var(--gray-300)]">{icon}</div>}
      {heading && <h3 className="text-size-h6 font-semibold text-[var(--gray-700)] mb-2">{heading}</h3>}
      {description && <p className="text-size-body-small text-[var(--gray-500)] mb-6 max-w-sm">{description}</p>}
      {action}
    </div>
  )
}
