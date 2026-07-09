import { Card } from '../Card'
import type { KpiCardProps } from './KpiCard.types'

export function KpiCard({ icon, title, value, variation, variationType = 'positive' }: KpiCardProps) {
  return (
      <Card padding="md" className="border border-[var(--border-color,var(--color-card-border))] shadow-[var(--shadow-sm)]">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--icon-bg,var(--color-primary-50))] flex items-center justify-center text-[var(--icon-color,var(--color-primary-600))] shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-size-caption text-[var(--color-text-secondary)] uppercase tracking-wider font-medium truncate">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-size-h4 font-bold text-[var(--color-text-primary)] leading-none">
              {value}
            </span>
            {variation && (
              <span className={`text-size-caption font-medium ${variationType === 'positive' ? 'text-[var(--color-success-600)]' : 'text-[var(--color-danger-600)]'}`}>
                {variation}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
