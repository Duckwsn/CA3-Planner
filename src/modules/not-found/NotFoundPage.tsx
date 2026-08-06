import { Button } from '../../shared/components/Button'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] flex flex-col items-center justify-center gap-2 text-center p-[40px_20px]">
      <h1 className="text-[96px] max-[480px]:text-[72px] font-black tracking-[-2px] leading-none bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-hover)] bg-clip-text text-transparent">
        404
      </h1>
      <p className="text-[17px] text-[var(--muted)] mb-5">
        Página não encontrada
      </p>
      <Button variant="primary" size="md" onClick={() => navigate('/dashboard')}>
        Voltar ao Dashboard
      </Button>
    </div>
  )
}
