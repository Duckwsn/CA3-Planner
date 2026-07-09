import { useState, useEffect, useRef, useCallback } from 'react'
import { User, Settings2, Bell, Shield, Loader2 } from 'lucide-react'
import { PageHeader } from '../../shared/components/PageHeader'
import { Input } from '../../shared/components/Input'
import { Select } from '../../shared/components/Select'
import { Switch } from '../../shared/components/Switch'
import { Button } from '../../shared/components/Button'
import { useUIStore } from '../../stores/core/uiStore'
import { useUserStore } from '../../stores/domain/userStore'
import { loadProfile, saveProfile, type ProfileData } from '../../utils/profile'
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
    // TODO: substituir por chamada de API quando o endpoint existir
    const data: ProfileData = { name, cargo, avatarUrl: avatarPreview ?? '' }
    saveProfile(data, userId || undefined)
    addToast('success', 'Perfil atualizado com sucesso')
    setSavingProfile(false)
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

  function renderTab() {
    switch (activeTab) {
      case 'perfil':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative w-20 h-20 shrink-0">
                <div
                  className="w-20 h-20 rounded-full bg-[var(--color-primary-100)] flex items-center justify-center text-[var(--color-primary-600)] text-[28px] font-bold overflow-hidden"
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    name?.charAt(0)?.toUpperCase() ?? 'U'
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <button
                  onClick={handleAvatarClick}
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[var(--color-primary-500)] flex items-center justify-center text-white cursor-pointer hover:bg-[var(--color-primary-700)] transition-colors"
                  aria-label="Trocar foto"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </button>
              </div>
              <div>
                <p className="text-size-body-small font-medium text-[var(--color-text-primary)]">{user?.name}</p>
                <p className="text-size-caption text-[var(--color-text-secondary)]">{user?.email}</p>
              </div>
            </div>

            <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />

            <div className="space-y-1.5">
              <label className="block text-size-body-small font-medium text-[var(--gray-700)]">E-mail</label>
              <input
                value={user?.email ?? ''}
                readOnly
                className="w-full h-11 px-3 rounded-[var(--radius-md)] border border-[var(--gray-300)] bg-[var(--gray-100)] text-size-body-small text-[var(--gray-400)] cursor-not-allowed"
              />
              <p className="text-size-caption text-[var(--gray-400)]">Não pode ser alterado</p>
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
          <div className="space-y-6">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-size-body-small font-medium text-[var(--color-text-primary)]">Tema escuro</p>
                <p className="text-size-caption text-[var(--color-text-secondary)]">Alternar entre tema claro e escuro</p>
              </div>
              <Switch checked={themeMode === 'dark'} onChange={(e) => handleThemeChange(e.target.checked)} />
            </div>

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
        )

      case 'notificacoes':
        return (
          <div className="space-y-1">
            {[
              { label: 'Notificar sobre tarefas atrasadas', key: NOTIF_KEYS.overdue },
              { label: 'Notificar sobre novas tarefas atribuídas', key: NOTIF_KEYS.assigned },
              { label: 'Notificar sobre comentários', key: NOTIF_KEYS.comments },
              { label: 'Resumo semanal por e-mail', key: NOTIF_KEYS.weekly },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-[14px] border-b border-[var(--color-border-light)]">
                <p className="text-size-body-small font-medium text-[var(--color-text-primary)]">{item.label}</p>
                <Switch
                  checked={notifPrefs[item.key] ?? false}
                  onChange={(e) => handleNotifToggle(item.key, e.target.checked)}
                />
              </div>
            ))}
          </div>
        )

      case 'seguranca':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-[13px] font-semibold text-[var(--gray-700)] mb-[6px]">Senha atual</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Sua senha atual"
                className={`w-full h-[44px] px-[14px] rounded-[8px] border bg-[var(--color-bg-input)] text-[14px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] outline-none transition-all focus:border-[var(--color-primary-500)] focus:shadow-[0_0_0_3px_rgba(79,95,224,0.15)] ${
                  securityErrors.currentPassword ? 'border-[var(--color-danger-500)]' : 'border-[var(--color-border-light)]'
                }`}
              />
              {securityErrors.currentPassword && <p className="text-[12px] text-[var(--color-danger-500)] mt-1">{securityErrors.currentPassword}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[var(--gray-700)] mb-[6px]">Nova senha</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className={`w-full h-[44px] px-[14px] rounded-[8px] border bg-[var(--color-bg-input)] text-[14px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] outline-none transition-all focus:border-[var(--color-primary-500)] focus:shadow-[0_0_0_3px_rgba(79,95,224,0.15)] ${
                  securityErrors.newPassword ? 'border-[var(--color-danger-500)]' : 'border-[var(--color-border-light)]'
                }`}
              />
              {securityErrors.newPassword && <p className="text-[12px] text-[var(--color-danger-500)] mt-1">{securityErrors.newPassword}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[var(--gray-700)] mb-[6px]">Confirmar nova senha</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Repita a nova senha"
                className={`w-full h-[44px] px-[14px] rounded-[8px] border bg-[var(--color-bg-input)] text-[14px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] outline-none transition-all focus:border-[var(--color-primary-500)] focus:shadow-[0_0_0_3px_rgba(79,95,224,0.15)] ${
                  securityErrors.confirmNewPassword ? 'border-[var(--color-danger-500)]' : 'border-[var(--color-border-light)]'
                }`}
              />
              {securityErrors.confirmNewPassword && <p className="text-[12px] text-[var(--color-danger-500)] mt-1">{securityErrors.confirmNewPassword}</p>}
            </div>

            <Button variant="primary" size="md" onClick={handleChangePassword} disabled={changingPassword}>
              {changingPassword ? <Loader2 size={16} className="animate-spin" /> : null}
              {changingPassword ? 'Alterando...' : 'Atualizar senha'}
            </Button>
          </div>
        )
    }
  }

  return (
    <div>
      <PageHeader title="Configurações" description="Preferências do sistema" />

      <div className="flex gap-6">
        <div className="w-[220px] shrink-0 space-y-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-[14px] py-[10px] rounded-[8px] text-left transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)] font-medium'
                  : 'text-[var(--gray-700)] hover:bg-[var(--gray-50)]'
              }`}
            >
              {tab.icon}
              <span className="text-size-body-small">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-[var(--color-bg-card)] rounded-[12px] border border-[var(--color-card-border)] shadow-[var(--shadow-sm)] p-6">
            {renderTab()}
          </div>
        </div>
      </div>
    </div>
  )
}
