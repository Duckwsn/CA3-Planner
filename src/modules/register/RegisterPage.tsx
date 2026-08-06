import { useState } from 'react'
import { Eye, EyeOff, ChevronDown } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useRegisterController } from './RegisterController'

interface FieldError {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  terms?: string
}

function validateForm(name: string, email: string, password: string, confirmPassword: string, termsAccepted: boolean): FieldError {
  const errors: FieldError = {}
  if (!name || name.trim().length < 3) errors.name = 'Nome deve ter no mínimo 3 caracteres'
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Formato de e-mail inválido'
  if (!password || password.length < 8) errors.password = 'Senha deve ter no mínimo 8 caracteres'
  if (password !== confirmPassword) errors.confirmPassword = 'Senhas não conferem'
  if (!termsAccepted) errors.terms = 'Você precisa aceitar os termos de uso'
  return errors
}

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [role, setRole] = useState('Professor')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [errors, setErrors] = useState<FieldError>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const { handleRegister } = useRegisterController()
  const navigate = useNavigate()

  function inputClass(field: keyof FieldError) {
    const hasError = !!errors[field]
    return `w-full px-[14px] py-[11px] rounded-[10px] border bg-[var(--color-bg-surface)] text-[14.5px] text-[var(--color-text-primary)] placeholder:text-[var(--muted-soft)] outline-none transition-all ${
      hasError
        ? 'border-[var(--color-danger)]'
        : 'border-[var(--color-card-border)] focus:border-[var(--color-focus-ring)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-focus-ring)_18%,transparent)]'
    }`
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError('')
    const validation = validateForm(name, email, password, confirmPassword, termsAccepted)
    setErrors(validation)
    if (Object.keys(validation).length > 0) return

    setLoading(true)
    try {
      const success = await handleRegister(name, email, password)
      if (success) navigate('/')
    } catch {
      setServerError('Erro ao conectar ao servidor')
    } finally {
      setLoading(false)
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

          <h2 className="text-[20px] font-bold text-[var(--color-text-primary)] mb-5">Criar conta</h2>

          <form onSubmit={onSubmit}>
            {serverError && (
              <div className="p-3 rounded-[10px] bg-[var(--color-danger-bg)] text-[13px] text-[var(--color-danger)] mb-4">
                {serverError}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="reg-name" className="block text-[13px] font-semibold text-[var(--color-text-secondary)] mb-[6px]">Nome completo</label>
              <input
                id="reg-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className={inputClass('name')}
                autoFocus
              />
              {errors.name && <p className="text-[12px] text-[var(--color-danger)] mt-1">{errors.name}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="reg-email" className="block text-[13px] font-semibold text-[var(--color-text-secondary)] mb-[6px]">E-mail</label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className={inputClass('email')}
              />
              {errors.email && <p className="text-[12px] text-[var(--color-danger)] mt-1">{errors.email}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="reg-role" className="block text-[13px] font-semibold text-[var(--color-text-secondary)] mb-[6px]">Função</label>
              <div className="relative">
                <select
                  id="reg-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-[14px] py-[11px] pr-10 rounded-[10px] border border-[var(--color-card-border)] bg-[var(--color-bg-surface)] text-[14.5px] text-[var(--color-text-primary)] appearance-none cursor-pointer outline-none transition-all focus:border-[var(--color-focus-ring)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-focus-ring)_18%,transparent)]"
                >
                  <option value="Professor">Professor</option>
                  <option value="Coordenador">Coordenador</option>
                  <option value="Administrador">Administrador</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-soft)] pointer-events-none" />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="reg-password" className="block text-[13px] font-semibold text-[var(--color-text-secondary)] mb-[6px]">Senha</label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className={`${inputClass('password')} pr-10`}
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
              {errors.password && <p className="text-[12px] text-[var(--color-danger)] mt-1">{errors.password}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="reg-confirm" className="block text-[13px] font-semibold text-[var(--color-text-secondary)] mb-[6px]">Confirmar senha</label>
              <div className="relative">
                <input
                  id="reg-confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a senha"
                  className={`${inputClass('confirmPassword')} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Mostrar senha"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-soft)] hover:text-[var(--color-text-primary)] cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-[12px] text-[var(--color-danger)] mt-1">{errors.confirmPassword}</p>}
            </div>

            <div className="mb-4">
              <div className="flex items-start gap-[10px]">
                <input
                  id="reg-terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-[2px] w-4 h-4 accent-[var(--color-brand)] cursor-pointer"
                />
                <label htmlFor="reg-terms" className="text-[13.5px] text-[var(--muted)] select-none cursor-pointer">
                  Li e aceito os termos de uso
                </label>
              </div>
              {errors.terms && <p className="text-[12px] text-[var(--color-danger)] mt-1">{errors.terms}</p>}
            </div>

            <button
              type="submit"
              disabled={!termsAccepted || loading}
              className="w-full py-[12px] rounded-[10px] bg-[var(--color-brand)] text-[var(--color-brand-ink)] text-[15px] font-bold mt-2 hover:bg-[var(--color-brand-bright)] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="text-[14px] text-[var(--muted)] text-center mt-5">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-[var(--color-info)] font-semibold hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
