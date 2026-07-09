import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../shared/components/Button'
import { Input } from '../../shared/components/Input'
import { useLoginController } from './LoginController'
import { useNavigate } from 'react-router-dom'


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

          <h2 className="text-[22px] font-bold text-[var(--color-text-primary)] mb-5 text-center">Entrar</h2>

          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-[8px] bg-[var(--color-danger-100)] text-size-body-small text-[var(--color-danger-600)]">
                {error}
              </div>
            )}

            <Input
              type="email"
              label="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              autoFocus
            />

            <div style={{ marginBottom: '16px' }}>
              <label className="block text-[13px] font-semibold text-[var(--color-text-secondary)] mb-[6px]">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  className="w-full h-[44px] px-[14px] pr-10 rounded-[8px] border border-[#E5E7EB] bg-white text-[14px] text-[var(--color-text-primary)] placeholder:text-[#9CA3AF] outline-none transition-all focus:border-[#4F5FE0] focus:shadow-[0_0_0_3px_rgba(79,95,224,0.15)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#4B5563] cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" size="md" fullWidth>
              Entrar
            </Button>
          </form>

          <p className="text-[13px] text-[#6B7280] text-center mt-6">
            Não tem conta?{' '}
            <Link to="/registrar" className="text-[#4F5FE0] hover:underline font-medium">
              Registre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
