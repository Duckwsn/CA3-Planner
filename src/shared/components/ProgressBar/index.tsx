interface ProgressBarProps {
  value: number
  max: number
  color?: string
  height?: string
  className?: string
}

export function ProgressBar({ value, max, color, height = 'h-2', className = '' }: ProgressBarProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0

  return (
    <div className={`${height} rounded-[var(--radius-full)] bg-[var(--color-progress-track)] overflow-hidden ${className}`}>
      <div
        className={`${height} rounded-[var(--radius-full)] transition-all`}
        style={{ width: `${pct}%`, backgroundColor: color ?? 'var(--color-progress-fill)' }}
      />
    </div>
  )
}

export function StackedProgressBar({ segments, height = 'h-3', className = '' }: {
  segments: { value: number; color: string }[]
  height?: string
  className?: string
}) {
  const total = segments.reduce((a, s) => a + s.value, 0)

  return (
    <div className={`${height} rounded-[var(--radius-full)] bg-[var(--color-progress-track)] overflow-hidden flex ${className}`}>
      {segments.map((seg, i) => {
        const pct = total > 0 ? (seg.value / total) * 100 : 0
        return pct > 0 ? (
          <div key={i} style={{ width: `${pct}%`, backgroundColor: seg.color }} className={`${height}`} />
        ) : null
      })}
    </div>
  )
}
