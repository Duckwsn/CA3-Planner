import { Skeleton, SkeletonLine, CardSkeleton, TableSkeleton } from '../Skeleton'

interface LoadingStateProps {
  lines?: number
  message?: string
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
        <Skeleton className="h-10 rounded-[var(--radius-md)] w-full" />
      </div>
    </div>
  )
}

export { Skeleton, SkeletonLine, CardSkeleton, TableSkeleton }
