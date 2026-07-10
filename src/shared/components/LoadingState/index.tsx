interface LoadingStateProps {
  lines?: number
  message?: string
}

function SkeletonLine({ width }: { width: string }) {
  return (
    <div
      className="h-4 rounded-[var(--radius-xs)] bg-[var(--gray-200)] animate-pulse"
      style={{ width }}
    />
  )
}

export function LoadingState({ lines = 4, message }: LoadingStateProps) {
  return (
    <div className="space-y-4 p-6">
      {message && <p className="text-size-body-small text-[var(--gray-500)] text-center">{message}</p>}
      <SkeletonLine width="40%" />
      {Array.from({ length: lines }, (_, i) => (
        <SkeletonLine key={i} width={`${70 - i * 10}%`} />
      ))}
      <div className="pt-4">
        <div className="h-10 rounded-[var(--radius-md)] bg-[var(--gray-200)] animate-pulse w-full" />
      </div>
    </div>
  )
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
