import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8 gap-4">
      <div className="min-w-0">
        <h1 className="text-size-h5 font-bold text-[var(--color-text-primary)] truncate">{title}</h1>
        {description && <p className="text-size-body-small text-[var(--color-text-secondary)] mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  )
}
