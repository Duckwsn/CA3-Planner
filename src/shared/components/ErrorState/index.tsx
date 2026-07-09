import { AlertTriangle } from 'lucide-react'
import { Button } from '../Button'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Erro ao carregar',
  description = 'Não foi possível carregar os dados. Tente novamente.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-full bg-[var(--color-danger-100)] flex items-center justify-center mb-4">
        <AlertTriangle size={28} className="text-[var(--color-danger-600)]" />
      </div>
      <h3 className="text-size-h6 font-semibold text-[var(--gray-700)] mb-2">{title}</h3>
      <p className="text-size-body-small text-[var(--gray-500)] mb-6 max-w-sm">{description}</p>
      {onRetry && (
        <Button variant="primary" size="md" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  )
}
