import type { KpiCardProps } from './KpiCard.types'

const toneClasses: Record<string, string> = {
  blue: 'bg-[var(--color-info-bg)] text-[var(--color-info)]',
  indigo: 'bg-[var(--color-purple-bg)] text-[var(--color-purple)]',
  green: 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
  red: 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]',
  amber: 'bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]',
}

export function KpiCard({ icon, title, value, variation, variationType = 'positive', tone = 'blue' }: KpiCardProps) {
  return (
    <div className="flex items-center gap-[18px] bg-[var(--color-bg-card)] border border-[var(--color-card-border)] rounded-[var(--radius-lg)] px-6 py-[22px] shadow-[var(--shadow-sm)]">
      <div className={`w-12 h-12 rounded-[11px] flex items-center justify-center text-[19px] shrink-0 ${toneClasses[tone]}`}>
        {icon}
      </div>
      <div className="flex flex-col gap-[3px] min-w-0">
        <p className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--muted-soft)] truncate">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-[32px] font-extrabold leading-none tabular-nums text-[var(--color-text-primary)]">
            {value}
          </span>
          {variation && (
            <span className={`text-[12.5px] font-semibold ${variationType === 'positive' ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
              {variation}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
