import { useState, useEffect, useRef, useCallback } from 'react'
import { User, Settings2, Bell, Shield, Loader2, Camera } from 'lucide-react'
import { Input } from '../../shared/components/Input'
import { Select } from '../../shared/components/Select'
import { Switch } from '../../shared/components/Switch'
import { Button } from '../../shared/components/Button'
import { useUIStore } from '../../stores/core/uiStore'
import { useAuthStore } from '../../stores/core/authStore'
import { useUserStore } from '../../stores/domain/userStore'
import { loadProfile, saveProfile } from '../../utils/profile'
import { NOTIF_KEYS, setLanguage as saveLangPref } from '../../utils/profile'
import { setTheme as applyThemePref, type ThemeMode } from '../../utils/theme'
import { setDateFormat } from '../../utils/formatDate'
import { loadUserPrefsOrGlobal, saveTheme, saveLanguage, saveDateFormat, saveNotificationPref, getCurrentUserId } from '../../utils/userPrefs'
import { AuthService } from '../../services/AuthService'

type TabId = 'perfil' | 'preferencias' | 'notificacoes' | 'seguranca'

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'perfil', label: 'Perfil', icon: <User size={18} /> },
  { id: 'preferencias', label: 'Preferências', icon: <Settings2 size={18} /> },
  { id: 'notificacoes', label: 'Notificações', icon: <Bell size={18} /> },
  { id: 'seguranca', label: 'Segurança', icon: <Shield size={18} /> },
]

const SWITCH_BRAND = '[&_input:checked+div]:bg-[var(--color-brand)]!'

const authInputClass =
  'w-full px-[14px] py-[11px] rounded-[10px] border bg-[var(--color-bg-surface)] text-[14.5px] text-[var(--color-text-primary)] placeholder:text-[var(--muted-soft)] outline-none transition-all focus:border-[var(--color-focus-ring)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-focus-ring)_18%,transparent)]'

const labelClass = 'block text-[13px] font-semibold text-[var(--gray-700)] mb-[6px]'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('perfil')
  const addToast = useUIStore((s) => s.addToast)
  const user = useUserStore((s) => s.user)

  // --- Perfil ---
  const userId = user?.id ?? getCurrentUserId() ?? ''
  const savedProfile = loadProfile(userId || undefined)
  const [name, setName] = useState(savedProfile?.name ?? user?.name ?? '')
  const [cargo, setCargo] = useState(savedProfile?.cargo ?? user?.role ?? 'Professor')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(savedProfile?.avatarUrl ?? null)
  const [savingProfile, setSavingProfile] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- Preferências ---
  const userPrefs = loadUserPrefsOrGlobal()
  const [themeMode, setThemeMode] = useState<ThemeMode>(userPrefs.theme)
  const [language, setLanguage] = useState(userPrefs.language)
  const [dateFmt, setDateFmt] = useState(userPrefs.dateFormat)

  // --- Notificações ---
  const [notifPrefs, setNotifPrefs] = useState<Record<string, boolean>>(() => userPrefs.notifications)

  // --- Segurança ---
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [securityErrors, setSecurityErrors] = useState<Record<string, string>>({})
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    const saved = loadProfile(userId || undefined)
    if (saved) {
      setName(saved.name)
      setCargo(saved.cargo)
      setAvatarPreview(saved.avatarUrl)
    }
  }, [userId])

  const handleAvatarClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleSaveProfile = useCallback(async () => {
    setSavingProfile(true)
    try {
      const updated = await AuthService.updateProfile({ name: name.trim(), role: cargo, avatar: avatarPreview ?? '' })
      useAuthStore.getState().setUser(updated)
      useUserStore.getState().setUser(updated)
      saveProfile({ name: updated.name, cargo: updated.role, avatarUrl: avatarPreview ?? '' }, userId || undefined)
      setName(updated.name)
      addToast('success', 'Perfil atualizado com sucesso')
    } catch {
      addToast('error', 'Não foi possível atualizar o perfil. Tente novamente.')
    } finally {
      setSavingProfile(false)
    }
  }, [name, cargo, avatarPreview, addToast, userId])

  const handleThemeChange = useCallback((checked: boolean) => {
    const mode: ThemeMode = checked ? 'dark' : 'light'
    setThemeMode(mode)
    applyThemePref(mode)
    if (userId) saveTheme(userId, mode)
  }, [userId])

  const handleLanguageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setLanguage(val)
    saveLangPref(val)
    if (userId) saveLanguage(userId, val)
    // TODO: aplicar i18n quando o sistema de traduções existir
  }, [userId])

  const handleDateFormatChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setDateFmt(val)
    setDateFormat(val)
    if (userId) saveDateFormat(userId, val)
    addToast('success', 'Formato de data atualizado')
  }, [addToast, userId])

  const handleNotifToggle = useCallback((key: string, value: boolean) => {
    setNotifPrefs((prev) => ({ ...prev, [key]: value }))
    if (userId) saveNotificationPref(userId, key, value)
  }, [userId])

  const handleChangePassword = useCallback(async () => {
    const errors: Record<string, string> = {}
    if (!currentPassword) errors.currentPassword = 'Senha atual é obrigatória'
    if (!newPassword || newPassword.length < 8) errors.newPassword = 'Nova senha deve ter no mínimo 8 caracteres'
    if (newPassword !== confirmNewPassword) errors.confirmNewPassword = 'Confirmação não confere com a nova senha'
    setSecurityErrors(errors)
    if (Object.keys(errors).length > 0) return

    setChangingPassword(true)
    try {
      const result = await AuthService.changePassword(currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
      setSecurityErrors({})
      addToast('success', result.mensagem)
    } catch (err: any) {
      const msg = err?.response?.data?.erro
      if (msg === 'Senha atual incorreta') {
        setSecurityErrors((prev) => ({ ...prev, currentPassword: msg }))
      } else if (msg) {
        addToast('error', msg)
      } else {
        console.error('[CHANGE_PASSWORD]', err)
        addToast('error', 'Não foi possível atualizar a senha. Tente novamente.')
      }
    } finally {
      setChangingPassword(false)
    }
  }, [currentPassword, newPassword, confirmNewPassword, addToast])

  const initials = (name?.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('') || 'U').toUpperCase()

  function renderTab() {
    switch (activeTab) {
      case 'perfil':
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-[17px] font-bold text-[var(--color-text-primary)]">Perfil</h2>
              <p className="text-[13px] text-[var(--muted-soft)] mt-1">Suas informações pessoais e de conta.</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-[72px] h-[72px] shrink-0">
                <div className="w-[72px] h-[72px] rounded-full bg-[var(--color-purple)] flex items-center justify-center text-white text-[24px] font-bold overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <button
                  onClick={handleAvatarClick}
                  className="absolute bottom-0 right-0 w-[26px] h-[26px] rounded-full bg-[var(--color-bg-surface)] border border-[var(--color-card-border)] text-[var(--muted)] flex items-center justify-center cursor-pointer hover:text-[var(--color-text-primary)] transition-colors"
                  aria-label="Trocar foto"
                >
                  <Camera size={12} />
                </button>
              </div>
              <div className="min-w-0">
                <p className="text-[16px] font-bold text-[var(--color-text-primary)] truncate">{user?.name}</p>
                <p className="text-[12.5px] text-[var(--muted-soft)] truncate">{user?.email}</p>
              </div>
            </div>

            <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />

            <div>
              <label className={labelClass}>E-mail</label>
              <div className="relative">
                <input
                  value={user?.email ?? ''}
                  readOnly
                  className="w-full px-[14px] py-[11px] pr-[130px] rounded-[10px] border border-[var(--color-card-border)] bg-[var(--color-bg-subtle)] text-[14.5px] text-[var(--muted-soft)] cursor-not-allowed outline-none"
                />
                <span className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[var(--muted-soft)] bg-[var(--color-bg-subtle)] px-2 py-[2px] rounded-full">
                  Não pode ser alterado
                </span>
              </div>
            </div>

            <Select
              label="Cargo / Função"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              options={[
                { value: 'Professor', label: 'Professor' },
                { value: 'Coordenador', label: 'Coordenador' },
                { value: 'Administrador', label: 'Administrador' },
              ]}
            />

            <div className="pt-2">
              <Button variant="primary" size="md" onClick={handleSaveProfile} disabled={savingProfile || !name.trim()}>
                {savingProfile ? <Loader2 size={16} className="animate-spin" /> : null}
                {savingProfile ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </div>
          </div>
        )

      case 'preferencias':
        return (
          <div>
            <div>
              <h2 className="text-[17px] font-bold text-[var(--color-text-primary)]">Preferências</h2>
              <p className="text-[13px] text-[var(--muted-soft)] mt-1">Personalize a aparência e o formato dos dados.</p>
            </div>

            <div className="flex items-center justify-between gap-4 py-[14px] border-b border-[var(--color-card-border)] mt-3">
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-[var(--color-text-primary)]">Tema escuro</p>
                <p className="text-[12.5px] text-[var(--muted-soft)]">Alternar entre tema claro e escuro</p>
              </div>
              <Switch
                checked={themeMode === 'dark'}
                onChange={(e) => handleThemeChange(e.target.checked)}
                className={SWITCH_BRAND}
              />
            </div>

            <div className="mt-[18px] space-y-4">
              <Select
                label="Idioma"
                value={language}
                onChange={handleLanguageChange}
                options={[
                  { value: 'pt', label: 'Português' },
                  { value: 'en', label: 'Inglês' },
                  { value: 'es', label: 'Espanhol' },
                ]}
              />

              <Select
                label="Formato de data"
                value={dateFmt}
                onChange={handleDateFormatChange}
                options={[
                  { value: 'dd/mm/aaaa', label: 'dd/mm/aaaa' },
                  { value: 'mm/dd/aaaa', label: 'mm/dd/aaaa' },
                ]}
              />
            </div>
          </div>
        )

      case 'notificacoes':
        return (
          <div>
            <div>
              <h2 className="text-[17px] font-bold text-[var(--color-text-primary)]">Notificações</h2>
              <p className="text-[13px] text-[var(--muted-soft)] mt-1">Escolha o que deseja receber.</p>
            </div>

            <div className="mt-3">
              {[
                { label: 'Notificar sobre tarefas atrasadas', key: NOTIF_KEYS.overdue, sub: 'Avisos de prazos estourados' },
                { label: 'Notificar sobre novas tarefas atribuídas', key: NOTIF_KEYS.assigned, sub: 'Quando você for designado' },
                { label: 'Notificar sobre comentários', key: NOTIF_KEYS.comments, sub: 'Respostas em suas tarefas' },
                { label: 'Resumo semanal por e-mail', key: NOTIF_KEYS.weekly, sub: 'Resumo das atividades da semana' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-4 py-[14px] border-b border-[var(--color-card-border)]">
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-[var(--color-text-primary)]">{item.label}</p>
                    <p className="text-[12.5px] text-[var(--muted-soft)]">{item.sub}</p>
                  </div>
                  <Switch
                    checked={notifPrefs[item.key] ?? false}
                    onChange={(e) => handleNotifToggle(item.key, e.target.checked)}
                    className={SWITCH_BRAND}
                  />
                </div>
              ))}
            </div>
          </div>
        )

      case 'seguranca':
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-[17px] font-bold text-[var(--color-text-primary)]">Segurança</h2>
              <p className="text-[13px] text-[var(--muted-soft)] mt-1">Altere sua senha de acesso.</p>
            </div>

            <div>
              <label className={labelClass}>Senha atual</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Sua senha atual"
                className={`${authInputClass} ${
                  securityErrors.currentPassword ? 'border-[var(--color-danger)]' : ''
                }`}
              />
              {securityErrors.currentPassword && <p className="text-[12px] text-[var(--color-danger)] mt-1">{securityErrors.currentPassword}</p>}
            </div>

            <div>
              <label className={labelClass}>Nova senha</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className={`${authInputClass} ${
                  securityErrors.newPassword ? 'border-[var(--color-danger)]' : ''
                }`}
              />
              {securityErrors.newPassword && <p className="text-[12px] text-[var(--color-danger)] mt-1">{securityErrors.newPassword}</p>}
            </div>

            <div>
              <label className={labelClass}>Confirmar nova senha</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Repita a nova senha"
                className={`${authInputClass} ${
                  securityErrors.confirmNewPassword ? 'border-[var(--color-danger)]' : ''
                }`}
              />
              {securityErrors.confirmNewPassword && <p className="text-[12px] text-[var(--color-danger)] mt-1">{securityErrors.confirmNewPassword}</p>}
            </div>

            <div className="pt-2">
              <Button variant="primary" size="md" onClick={handleChangePassword} disabled={changingPassword}>
                {changingPassword ? <Loader2 size={16} className="animate-spin" /> : null}
                {changingPassword ? 'Alterando...' : 'Atualizar senha'}
              </Button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <div className="flex lg:flex-col gap-1 w-full lg:w-[220px] shrink-0 overflow-x-auto lg:overflow-visible">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-[10px] px-[14px] py-[11px] rounded-[9px] text-left transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === tab.id
                ? 'bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)] font-bold'
                : 'text-[var(--muted)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            {tab.icon}
            <span className="text-[14px]">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 min-w-0 w-full lg:w-auto">
        <div className="bg-[var(--color-bg-surface)] border border-[var(--color-card-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] p-[20px_16px] sm:p-[28px_30px] max-w-[640px]">
          {renderTab()}
        </div>
      </div>
    </div>
  )
}
