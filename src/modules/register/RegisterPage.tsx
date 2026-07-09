import { useState } from 'react'
import { Eye, EyeOff, Check } from 'lucide-react'
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
    return `w-full h-[44px] px-[14px] rounded-[8px] border bg-white text-[14px] text-[var(--color-text-primary)] placeholder:text-[#9CA3AF] outline-none transition-all ${
      hasError
        ? 'border-[#D6336C]'
        : 'border-[#E5E7EB] focus:border-[#4F5FE0] focus:shadow-[0_0_0_3px_rgba(79,95,224,0.15)]'
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
    <div className="min-h-screen bg-[var(--color-bg-page)] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        <div className="bg-white rounded-[16px] p-[40px_32px] shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-[72px] h-[72px] rounded-[16px] bg-[#F5A623] flex items-center justify-center mb-3">
              <span className="text-[#1B2452] font-extrabold text-[22px] leading-none">CA3</span>
            </div>
            <h1 className="text-[20px] font-bold text-[var(--color-text-primary)]">CA3 Planner</h1>
            <p className="text-[13px] text-[#6B7280] mt-0.5">Pedagógico</p>
          </div>

          <h2 className="text-[22px] font-bold text-[var(--color-text-primary)] mb-5">Criar conta</h2>

          <form onSubmit={onSubmit}>
            {serverError && (
              <div className="p-3 rounded-[8px] bg-[#FEE2E2] text-[13px] text-[#D6336C] mb-4">
                {serverError}
              </div>
            )}

            {/* Nome completo */}
            <div style={{ marginBottom: '16px' }}>
              <label className="block text-[13px] font-semibold text-[var(--color-text-secondary)] mb-[6px]">Nome completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className={inputClass('name')}
                autoFocus
              />
              {errors.name && <p className="text-[12px] text-[#D6336C] mt-1">{errors.name}</p>}
            </div>

            {/* E-mail */}
            <div style={{ marginBottom: '16px' }}>
              <label className="block text-[13px] font-semibold text-[var(--color-text-secondary)] mb-[6px]">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className={inputClass('email')}
              />
              {errors.email && <p className="text-[12px] text-[#D6336C] mt-1">{errors.email}</p>}
            </div>

            {/* Função */}
            <div style={{ marginBottom: '16px' }}>
              <label className="block text-[13px] font-semibold text-[var(--color-text-secondary)] mb-[6px]">Função</label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-[44px] px-[14px] pr-10 rounded-[8px] border border-[#E5E7EB] bg-white text-[14px] text-[var(--color-text-primary)] appearance-none cursor-pointer outline-none transition-all focus:border-[#4F5FE0] focus:shadow-[0_0_0_3px_rgba(79,95,224,0.15)]"
                >
                  <option value="Professor">Professor</option>
                  <option value="Coordenador">Coordenador</option>
                  <option value="Administrador">Administrador</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {/* Senha */}
            <div style={{ marginBottom: '16px' }}>
              <label className="block text-[13px] font-semibold text-[var(--color-text-secondary)] mb-[6px]">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className={`${inputClass('password')} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#4B5563] cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-[12px] text-[#D6336C] mt-1">{errors.password}</p>}
            </div>

            {/* Confirmar senha */}
            <div style={{ marginBottom: '16px' }}>
              <label className="block text-[13px] font-semibold text-[var(--color-text-secondary)] mb-[6px]">Confirmar senha</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a senha"
                  className={`${inputClass('confirmPassword')} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#4B5563] cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-[12px] text-[#D6336C] mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Termos */}
            <div style={{ marginBottom: '16px' }}>
              <label className="inline-flex items-center gap-3 cursor-pointer">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={`w-5 h-5 rounded-[4px] border-2 transition-colors duration-150 ${
                    termsAccepted
                      ? 'border-[#4F5FE0] bg-[#4F5FE0]'
                      : errors.terms ? 'border-[#D6336C]' : 'border-[#D1D5DB]'
                  }`} />
                  <Check size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <span className="text-[13px] text-[var(--color-text-secondary)] select-none">Li e aceito os termos de uso</span>
              </label>
              {errors.terms && <p className="text-[12px] text-[#D6336C] mt-1">{errors.terms}</p>}
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={!termsAccepted || loading}
              className="w-full h-[46px] rounded-[8px] font-bold text-[#1B2452] bg-[#F5A623] hover:bg-[#E0951A] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="text-[13px] text-[#6B7280] text-center mt-6">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-[#4F5FE0] hover:underline font-medium">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
