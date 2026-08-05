interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`h-4 rounded-[var(--radius-xs)] bg-[var(--gray-200)] animate-pulse ${className}`}
      aria-hidden="true"
    />
  )
}

export function SkeletonLine({ width }: { width: string }) {
  return <div className="h-4 rounded-[var(--radius-xs)] bg-[var(--gray-200)] animate-pulse" style={{ width }} />
}

export function CardSkeleton() {
  return (
    <div className="bg-[var(--color-bg-card)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] p-6 space-y-4">
      <SkeletonLine width="60%" />
      <SkeletonLine width="100%" />
      <SkeletonLine width="80%" />
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: cols }, (_, c) => (
            <div key={c} className="flex-1 h-6 rounded-[var(--radius-xs)] bg-[var(--gray-200)] animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  )
}
