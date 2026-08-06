import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useLoginController } from './LoginController'

const authInputClass =
  'w-full px-[14px] py-[11px] rounded-[10px] border border-[var(--color-card-border)] bg-[var(--color-bg-surface)] text-[14.5px] text-[var(--color-text-primary)] placeholder:text-[var(--muted-soft)] outline-none transition-all focus:border-[var(--color-focus-ring)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-focus-ring)_18%,transparent)]'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@escola.edu')
  const [password, setPassword] = useState('123456')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { handleLogin } = useLoginController()
  const navigate = useNavigate()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const success = await handleLogin(email, password)
      if (success) navigate('/')
    } catch {
      setError('Erro ao conectar ao servidor')
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] flex items-center justify-center p-[48px_20px]">
      <div className="w-full max-w-[420px]">
        <div className="w-full max-w-[420px] bg-[var(--color-bg-surface)] border border-[var(--color-card-border)] rounded-[16px] shadow-[var(--shadow-md)] p-[40px_36px]">
          <div className="flex flex-col items-center gap-3 mb-7">
            <div className="w-[72px] h-[72px] rounded-[14px] bg-[var(--color-brand)] flex items-center justify-center">
              <span className="text-[var(--color-brand-ink)] font-extrabold text-[20px] leading-none">CA3</span>
            </div>
            <div className="text-center">
              <h1 className="text-[22px] font-extrabold text-[var(--color-text-primary)] leading-tight">CA3 Planner</h1>
              <p className="text-[12.5px] text-[var(--muted-soft)] mt-0.5">Pedagógico</p>
            </div>
          </div>

          <h2 className="text-[20px] font-bold text-[var(--color-text-primary)] mb-5 text-center">Entrar</h2>

          <form onSubmit={onSubmit}>
            {error && (
              <div className="p-3 rounded-[10px] bg-[var(--color-danger-bg)] text-size-body-small text-[var(--color-danger)] mb-4">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="login-email" className="block text-[13px] font-semibold text-[var(--color-text-secondary)] mb-[6px]">
                E-mail
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                autoFocus
                className={authInputClass}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="login-password" className="block text-[13px] font-semibold text-[var(--color-text-secondary)] mb-[6px]">
                Senha
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  className={`${authInputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Mostrar senha"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-soft)] hover:text-[var(--color-text-primary)] cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-[12px] rounded-[10px] bg-[var(--color-brand)] text-[var(--color-brand-ink)] text-[15px] font-bold mt-2 hover:bg-[var(--color-brand-bright)] transition-colors cursor-pointer"
            >
              Entrar
            </button>
          </form>

          <p className="text-[14px] text-[var(--muted)] text-center mt-5">
            Não tem conta?{' '}
            <Link to="/registrar" className="text-[var(--color-info)] font-semibold hover:underline">
              Registre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
