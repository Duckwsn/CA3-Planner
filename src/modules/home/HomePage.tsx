import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutGrid,
  Calendar,
  Users,
  BarChart2,
  Menu,
  X,
  Check,
  ArrowRight,
} from 'lucide-react'
import { useAuthStore } from '../../stores/core/authStore'

const NAV_LINKS = [
  { label: 'Funcionalidades', href: '#features' },
  { label: 'Como funciona', href: '#how-it-works' },
  { label: 'Sobre', href: '#footer' },
]

const FEATURES = [
  {
    icon: LayoutGrid,
    title: 'Quadros Kanban',
    text: 'Organize tarefas por disciplina ou turma em quadros visuais com arrastar e soltar.',
  },
  {
    icon: Calendar,
    title: 'Calendário Integrado',
    text: 'Visualize prazos, entregas e eventos de toda a escola em um calendário único.',
  },
  {
    icon: Users,
    title: 'Equipes Colaborativas',
    text: 'Toda a escola trabalhando no mesmo ambiente, com equipes compartilhadas.',
  },
  {
    icon: BarChart2,
    title: 'Relatórios em Tempo Real',
    text: 'Acompanhe progresso e produtividade com dashboards automáticos.',
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Crie sua conta',
    text: 'Cadastre-se gratuitamente em menos de 2 minutos. Não precisa de cartão de crédito.',
  },
  {
    num: '02',
    title: 'Monte seus quadros',
    text: 'Crie quadros Kanban para cada turma ou disciplina e organize as tarefas do seu jeito.',
  },
  {
    num: '03',
    title: 'Acompanhe o progresso',
    text: 'Visualize relatórios, gerencie prazos e mantenha toda a equipe alinhada.',
  },
]

function DashboardMockup() {
  return (
    <div className="rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] transform perspective-[1000px] rotateY-[-6deg] rotateX-[2deg] transition-transform duration-500">
      <div className="bg-[#1E1E2E] px-4 py-3 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
        <div className="w-3 h-3 rounded-full bg-[#28C840]" />
        <span className="text-[#6B7280] text-xs ml-2">CA3 Planner — Dashboard</span>
      </div>
      <div className="bg-[var(--color-bg-page)] p-5 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 bg-[var(--color-bg-card)] rounded-lg p-4 border border-[var(--color-card-border)]">
            <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">Tarefas Hoje</p>
            <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">12</p>
            <div className="mt-2 h-1.5 bg-[var(--color-progress-track)] rounded-full overflow-hidden">
              <div className="h-full w-[60%] bg-[var(--color-progress-fill)] rounded-full" />
            </div>
          </div>
          <div className="flex-1 bg-[var(--color-bg-card)] rounded-lg p-4 border border-[var(--color-card-border)]">
            <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">Concluídas</p>
            <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">8</p>
            <p className="text-xs text-[var(--color-success-500)] mt-1">+3 esta semana</p>
          </div>
          <div className="flex-1 bg-[var(--color-bg-card)] rounded-lg p-4 border border-[var(--color-card-border)]">
            <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">Equipes</p>
            <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">5</p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">12 membros ativos</p>
          </div>
        </div>
        <div className="bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-card-border)] p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Tarefas Recentes</h4>
            <span className="text-xs text-[var(--color-text-secondary)]">Ver todas</span>
          </div>
          <div className="space-y-2">
            {['Planejamento aula Matemática', 'Correção provas 3º ano', 'Reunião pedagógica'].map((t) => (
              <div key={t} className="flex items-center gap-3 py-1.5">
                <div className="w-4 h-4 rounded border border-[var(--color-card-border)] flex items-center justify-center">
                  <Check size={12} className="text-[var(--color-success-500)]" />
                </div>
                <span className="text-sm text-[var(--color-text-primary)]">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Navbar({ scrolled, onOpenMenu }: { scrolled: boolean; onOpenMenu: () => void }) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--color-sidebar-bg)] shadow-[0_2px_12px_rgba(0,0,0,0.15)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-5 lg:px-8 h-[72px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-sidebar-logo-bg)] flex items-center justify-center shrink-0">
            <span className="text-[var(--color-sidebar-item-active-text)] font-extrabold text-sm">CA3</span>
          </div>
          <span className="text-white font-bold text-base">CA3 Planner</span>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/80 hover:text-white transition-colors border-b-2 border-transparent hover:border-[var(--color-ca3-amber-500)] pb-0.5"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/login"
            className="h-12 px-7 rounded-lg border border-white text-white font-bold text-sm hover:bg-white/10 transition-colors inline-flex items-center justify-center"
          >
            Entrar
          </Link>
          <Link
            to="/registrar"
            className="h-12 px-7 rounded-lg bg-[var(--color-ca3-amber-500)] text-[var(--color-sidebar-item-active-text)] font-bold text-sm hover:bg-[var(--color-ca3-amber-600)] transition-colors inline-flex items-center justify-center"
          >
            Criar conta
          </Link>
        </div>

        <button
          onClick={onOpenMenu}
          className="lg:hidden text-white hover:text-[var(--color-ca3-amber-500)] transition-colors cursor-pointer"
          aria-label="Abrir menu"
        >
          <Menu size={24} />
        </button>
      </div>
    </header>
  )
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <div className="absolute top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-[var(--color-sidebar-bg)] shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 h-[72px] border-b border-white/10">
              <span className="text-white font-bold text-base">Menu</span>
              <button onClick={onClose} className="text-white/80 hover:text-white transition-colors cursor-pointer" aria-label="Fechar menu">
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="block px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="px-4 pb-8 space-y-3">
              <Link
                to="/login"
                onClick={onClose}
                className="w-full h-12 rounded-lg border border-white text-white font-bold text-sm flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                Entrar
              </Link>
              <Link
                to="/registrar"
                onClick={onClose}
                className="w-full h-12 rounded-lg bg-[var(--color-ca3-amber-500)] text-[var(--color-sidebar-item-active-text)] font-bold text-sm flex items-center justify-center hover:bg-[var(--color-ca3-amber-600)] transition-colors"
              >
                Criar conta
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function HeroSection() {
  return (
    <section className="min-h-[640px] flex items-center pt-[72px] bg-gradient-to-br from-[var(--color-sidebar-bg)] to-[var(--color-ca3-navy-900)]">
      <div className="w-full max-w-[1440px] mx-auto px-5 lg:px-8 py-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="max-lg:text-center">
            <span className="inline-flex items-center gap-2 text-[var(--color-ca3-amber-500)] text-xs uppercase tracking-[0.03em] font-semibold mb-4">
              <span className="w-6 h-px bg-[var(--color-ca3-amber-500)]" />
              Sistema de Gestão Pedagógica
            </span>
            <h1 className="text-[var(--color-ca3-text-light-primary)] text-[clamp(2rem,5vw,3rem)] leading-[1.1] font-extrabold mb-5">
              Organize o planejamento pedagógico da sua escola em um só lugar
            </h1>
            <p className="text-[var(--color-ca3-text-light-secondary)] text-lg leading-relaxed mb-8 max-lg:mx-auto max-w-xl">
              Quadros Kanban, calendário integrado, equipes colaborativas e relatórios
              em tempo real — tudo que sua escola precisa para transformar a gestão pedagógica.
            </p>
            <div className="flex max-lg:flex-col items-center gap-4 mb-4">
              <Link
                to="/registrar"
                className="h-12 px-7 rounded-lg bg-[var(--color-ca3-amber-500)] text-[var(--color-sidebar-item-active-text)] font-bold text-sm hover:bg-[var(--color-ca3-amber-600)] transition-colors inline-flex items-center gap-2"
              >
                Começar agora
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/login"
                className="h-12 px-7 rounded-lg border border-white/60 text-white font-bold text-sm hover:bg-white/10 transition-colors inline-flex items-center justify-center"
              >
                Já tenho conta
              </Link>
            </div>
            <p className="text-xs text-[var(--color-ca3-text-light-secondary)]/60">
              Sem cartão de crédito · Configuração em minutos
            </p>
          </div>

          <div className="hidden lg:block">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-[80px] bg-[var(--color-bg-card)]">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[var(--color-ca3-amber-500)] text-xs uppercase tracking-[0.03em] font-semibold">
            Funcionalidades
          </span>
          <h2 className="text-[var(--color-text-primary)] text-[clamp(1.5rem,3.5vw,2rem)] font-bold mt-3 mb-4">
            Tudo que sua escola precisa para se organizar
          </h2>
          <p className="text-[var(--color-text-secondary)] text-base max-w-2xl mx-auto">
            Módulos integrados que simplificam o dia a dia de professores, coordenadores e gestores.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-[var(--color-bg-surface)] border border-[var(--color-card-border)] rounded-xl p-7 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--color-icon-bg)] flex items-center justify-center mb-5">
                <f.icon size={22} className="text-[var(--color-ca3-amber-500)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-[80px] bg-[var(--color-bg-page)]">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[var(--color-ca3-amber-500)] text-xs uppercase tracking-[0.03em] font-semibold">
            Comece em 3 passos
          </span>
          <h2 className="text-[var(--color-text-primary)] text-[clamp(1.5rem,3.5vw,2rem)] font-bold mt-3">
            Comece em 3 passos simples
          </h2>
        </div>

        <div className="relative grid md:grid-cols-3 gap-8 md:gap-12">
          <div className="hidden md:block absolute top-12 left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-px border-t-2 border-dashed border-[var(--color-card-border)]" />
          {STEPS.map((step, i) => (
            <div key={step.num} className="relative flex flex-col items-center text-center">
              <span className="block text-[var(--color-ca3-amber-500)] text-4xl font-extrabold opacity-30 mb-4 md:mb-6">
                {step.num}
              </span>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                {i + 1}. {step.title}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-[280px] mx-auto">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-16 lg:py-20 bg-[var(--color-ca3-amber-500)]">
      <div className="max-w-[640px] mx-auto px-5 text-center">
        <h2 className="text-[var(--color-sidebar-item-active-text)] text-[clamp(1.25rem,3vw,1.75rem)] font-bold mb-4">
          Pronto para organizar o planejamento da sua escola?
        </h2>
        <p className="text-[var(--color-sidebar-item-active-text)] text-base opacity-80 mb-8">
          Junte-se a centenas de escolas que já transformaram sua gestão pedagógica.
        </p>
        <Link
          to="/registrar"
          className="inline-flex items-center gap-2 h-13 px-9 rounded-lg bg-[var(--color-sidebar-item-active-text)] text-white font-bold text-base hover:opacity-90 transition-opacity"
        >
          Criar conta gratuita
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  )
}

function FooterSection() {
  return (
    <footer id="footer" className="bg-[var(--color-ca3-navy-900)] pt-12 pb-6 px-5 lg:px-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-wrap justify-between gap-8 mb-10">
          <div className="min-w-[200px]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--color-sidebar-logo-bg)] flex items-center justify-center">
                <span className="text-[var(--color-sidebar-item-active-text)] font-extrabold text-xs">CA3</span>
              </div>
              <span className="text-white font-bold text-base">CA3 Planner</span>
            </div>
            <p className="text-[var(--color-ca3-text-light-secondary)] text-sm">Pedagógico</p>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Produto</h4>
            <ul className="space-y-2">
              {['Funcionalidades', 'Como funciona'].map((label) => (
                <li key={label}>
                  <a
                    href={label === 'Funcionalidades' ? '#features' : '#how-it-works'}
                    className="text-[var(--color-ca3-text-light-secondary)] text-sm hover:text-[var(--color-ca3-text-light-primary)] transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Conta</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-[var(--color-ca3-text-light-secondary)] text-sm hover:text-[var(--color-ca3-text-light-primary)] transition-colors">
                  Entrar
                </Link>
              </li>
              <li>
                <Link to="/registrar" className="text-[var(--color-ca3-text-light-secondary)] text-sm hover:text-[var(--color-ca3-text-light-primary)] transition-colors">
                  Criar conta
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Contato</h4>
            <p className="text-[var(--color-ca3-text-light-secondary)] text-sm">suporte@ca3educ.com.br</p>
          </div>
        </div>

        <div className="border-t border-[var(--color-ca3-navy-border)] pt-6">
          <p className="text-center text-[var(--color-ca3-text-light-secondary)] text-xs">
            &copy; 2026 CA3 Educ. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (isAuthenticated) return null

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)]">
      <Navbar scrolled={scrolled} onOpenMenu={() => setMobileOpen(true)} />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <FooterSection />
    </div>
  )
}
