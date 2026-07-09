import { Button } from '../../shared/components/Button'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-size-h1 font-bold text-[var(--gray-900)] font-[var(--font-secondary)] mb-2">
          404
        </h1>
        <p className="text-size-body text-[var(--gray-500)] mb-8">
          Página não encontrada
        </p>
        <Button variant="primary" size="md" onClick={() => navigate('/')}>
          Voltar ao Dashboard
        </Button>
      </div>
    </div>
  )
}
