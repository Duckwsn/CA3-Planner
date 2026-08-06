import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  LayoutDashboard,
  Users,
  Building2,
  Database,
  Plus,
  Pencil,
  Trash2,
  KeyRound,
  Play,
  ShieldOff,
  RefreshCw,
  AlertTriangle,
  Terminal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '../../shared/components/Button'
import { Card } from '../../shared/components/Card'
import { Modal } from '../../shared/components/Modal'
import { Input } from '../../shared/components/Input'
import { Select } from '../../shared/components/Select'
import { EmptyState } from '../../shared/components/EmptyState'
import { AdminService } from '../../services/AdminService'
import { useUIStore } from '../../stores/core/uiStore'
import type {
  AdminStats,
  AdminUser,
  AdminOrganization,
  TableInfo,
  TableRowsResult,
  SqlResult,
} from '../../types/admin.types'

type TabId = 'overview' | 'users' | 'orgs' | 'db'

const TABS: { id: TabId; label: string; icon: ReactNode }[] = [
  { id: 'overview', label: 'Visão Geral', icon: <LayoutDashboard size={16} /> },
  { id: 'users', label: 'Usuários', icon: <Users size={16} /> },
  { id: 'orgs', label: 'Organizações', icon: <Building2 size={16} /> },
  { id: 'db', label: 'Banco de Dados', icon: <Database size={16} /> },
]

interface UserFormState {
  name: string
  email: string
  password: string
  role: string
  organizationId: string
}

type DeleteTarget =
  | { kind: 'user'; id: string; name: string }
  | { kind: 'org'; id: string; name: string }
  | { kind: 'row'; table: string; id: string; name: string }

const EMPTY_USER_FORM: UserFormState = { name: '', email: '', password: '', role: 'Membro', organizationId: '' }

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card border className="px-[22px] py-5">
      <p className="text-[30px] font-extrabold leading-none tabular-nums text-[var(--color-text-primary)] mb-[6px]">{value}</p>
      <p className="text-[12.5px] text-[var(--muted-soft)] font-medium">{label}</p>
    </Card>
  )
}

function RoleBadge({ role }: { role: string }) {
  const r = role?.toLowerCase() ?? ''
  let cls = 'bg-[var(--color-bg-subtle)] text-[var(--muted)]'
  if (r.includes('admin')) cls = 'bg-[var(--color-purple-bg)] text-[var(--color-purple)]'
  else if (r.includes('coord')) cls = 'bg-[var(--color-info-bg)] text-[var(--color-info)]'
  return (
    <span className={`inline-flex items-center px-[10px] py-[3px] rounded-[var(--radius-full)] text-[11.5px] font-semibold whitespace-nowrap ${cls}`}>
      {role}
    </span>
  )
}

function buildPages(current: number, total: number): (number | 'dots')[] {
  const pages: (number | 'dots')[] = []
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== 'dots') {
      pages.push('dots')
    }
  }
  return pages
}

const thClass = 'px-5 py-3 font-bold bg-[var(--color-bg-subtle)]'
const tdClass = 'px-5 py-[13px] text-[13.5px] border-b border-[var(--color-card-border)]'
const rowHoverClass = 'hover:bg-[var(--color-bg-subtle)]'

export default function AdminPage() {
  const addToast = useUIStore((s) => s.addToast)
  const [checkingAccess, setCheckingAccess] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [tab, setTab] = useState<TabId>('overview')

  const [stats, setStats] = useState<AdminStats | null>(null)
  const [statsError, setStatsError] = useState('')

  const [users, setUsers] = useState<AdminUser[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersPage, setUsersPage] = useState(1)
  const USERS_PER_PAGE = 8

  const [orgs, setOrgs] = useState<AdminOrganization[]>([])

  const [userModalOpen, setUserModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [userForm, setUserForm] = useState<UserFormState>(EMPTY_USER_FORM)

  const [resetUser, setResetUser] = useState<AdminUser | null>(null)
  const [resetPassword, setResetPassword] = useState('')

  const [orgModalOpen, setOrgModalOpen] = useState(false)
  const [editingOrg, setEditingOrg] = useState<AdminOrganization | null>(null)
  const [orgName, setOrgName] = useState('')

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [tables, setTables] = useState<TableInfo[]>([])
  const [selectedTable, setSelectedTable] = useState('')
  const [tableRows, setTableRows] = useState<Record<string, unknown>[]>([])
  const [tableTotal, setTableTotal] = useState(0)
  const [tableLoading, setTableLoading] = useState(false)

  const [rowModalOpen, setRowModalOpen] = useState(false)
  const [editingRow, setEditingRow] = useState<Record<string, unknown> | null>(null)
  const [rowJson, setRowJson] = useState('')
  const [rowError, setRowError] = useState('')

  const [sqlQuery, setSqlQuery] = useState('')
  const [sqlResult, setSqlResult] = useState<SqlResult | null>(null)
  const [sqlError, setSqlError] = useState('')
  const [sqlRunning, setSqlRunning] = useState(false)

  async function loadStats() {
    setStatsError('')
    try {
      setStats(await AdminService.stats())
    } catch {
      setStatsError('Não foi possível carregar as estatísticas.')
    }
  }

  async function loadUsers() {
    setUsersLoading(true)
    try {
      setUsers(await AdminService.listUsers())
    } catch {
      addToast('error', 'Não foi possível carregar os usuários.')
    } finally {
      setUsersLoading(false)
    }
  }

  async function loadOrgs() {
    try {
      setOrgs(await AdminService.listOrganizations())
    } catch {
      addToast('error', 'Não foi possível carregar as organizações.')
    }
  }

  async function loadTables() {
    try {
      const list = await AdminService.listTables()
      setTables(list)
      const first = list[0]
      if (!selectedTable && first) setSelectedTable(first.name)
    } catch {
      addToast('error', 'Não foi possível carregar as tabelas.')
    }
  }

  async function loadTableRows() {
    if (!selectedTable) return
    setTableLoading(true)
    setSqlError('')
    try {
      const result: TableRowsResult = await AdminService.getTableRows(selectedTable, 200, 0)
      setTableRows(result.rows)
      setTableTotal(result.total)
    } catch {
      setTableRows([])
      addToast('error', 'Não foi possível carregar as linhas.')
    } finally {
      setTableLoading(false)
    }
  }

  useEffect(() => {
    AdminService.access()
      .then(({ isAdmin: admin }) => {
        setIsAdmin(admin)
        if (admin) {
          loadStats()
          loadUsers()
          loadOrgs()
          loadTables()
        }
      })
      .catch(() => setIsAdmin(false))
      .finally(() => setCheckingAccess(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isAdmin && selectedTable) loadTableRows()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, selectedTable])

  useEffect(() => {
    if (usersPage > totalUsersPages) setUsersPage(totalUsersPages)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users.length])

  async function handleSaveUser() {
    if (!userForm.name.trim() || !userForm.email.trim()) return
    try {
      if (editingUser) {
        const data: Record<string, unknown> = { name: userForm.name, email: userForm.email, role: userForm.role, organizationId: userForm.organizationId }
        if (userForm.password.trim()) data.password = userForm.password
        await AdminService.updateUser(editingUser.id, data)
        addToast('success', 'Usuário atualizado.')
      } else {
        await AdminService.createUser({ ...userForm, password: userForm.password })
        addToast('success', 'Usuário criado.')
      }
      setUserModalOpen(false)
      setUserForm(EMPTY_USER_FORM)
      setEditingUser(null)
      loadUsers()
      loadStats()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Não foi possível salvar o usuário.'
      addToast('error', msg)
    }
  }

  function openCreateUser() {
    setEditingUser(null)
    setUserForm({ ...EMPTY_USER_FORM, organizationId: orgs[0]?.id ?? '' })
    setUserModalOpen(true)
  }

  function openEditUser(user: AdminUser) {
    setEditingUser(user)
    setUserForm({ name: user.name, email: user.email, password: '', role: user.role, organizationId: user.organizationId })
    setUserModalOpen(true)
  }

  async function handleResetPassword() {
    if (!resetUser || resetPassword.length < 6) return
    try {
      await AdminService.resetPassword(resetUser.id, resetPassword)
      addToast('success', 'Senha redefinida.')
      setResetUser(null)
      setResetPassword('')
    } catch {
      addToast('error', 'Não foi possível redefinir a senha.')
    }
  }

  async function handleSaveOrg() {
    if (!orgName.trim()) return
    try {
      if (editingOrg) {
        await AdminService.updateOrganization(editingOrg.id, orgName.trim())
        addToast('success', 'Organização atualizada.')
      } else {
        await AdminService.createOrganization(orgName.trim())
        addToast('success', 'Organização criada.')
      }
      setOrgModalOpen(false)
      setEditingOrg(null)
      setOrgName('')
      loadOrgs()
      loadStats()
    } catch {
      addToast('error', 'Não foi possível salvar a organização.')
    }
  }

  function openCreateOrg() {
    setEditingOrg(null)
    setOrgName('')
    setOrgModalOpen(true)
  }

  function openEditOrg(org: AdminOrganization) {
    setEditingOrg(org)
    setOrgName(org.name)
    setOrgModalOpen(true)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      if (deleteTarget.kind === 'user') await AdminService.deleteUser(deleteTarget.id)
      if (deleteTarget.kind === 'org') await AdminService.deleteOrganization(deleteTarget.id)
      if (deleteTarget.kind === 'row') await AdminService.deleteTableRow(deleteTarget.table, deleteTarget.id)
      addToast('success', 'Registro excluído.')
      setDeleteTarget(null)
      if (deleteTarget.kind === 'user') { loadUsers(); loadStats() }
      if (deleteTarget.kind === 'org') { loadOrgs(); loadStats() }
      if (deleteTarget.kind === 'row') loadTableRows()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Não foi possível excluir o registro.'
      addToast('error', msg)
    } finally {
      setDeleting(false)
    }
  }

  function openCreateRow() {
    setEditingRow(null)
    setRowJson('{}')
    setRowError('')
    setRowModalOpen(true)
  }

  function openEditRow(row: Record<string, unknown>) {
    setEditingRow(row)
    setRowJson(JSON.stringify(row, null, 2))
    setRowError('')
    setRowModalOpen(true)
  }

  async function handleSaveRow() {
    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(rowJson) as Record<string, unknown>
    } catch {
      setRowError('JSON inválido.')
      return
    }
    try {
      if (editingRow) {
        await AdminService.updateTableRow(selectedTable, editingRow.id as string, parsed)
      } else {
        await AdminService.createTableRow(selectedTable, parsed)
      }
      setRowModalOpen(false)
      loadTableRows()
      loadStats()
      loadTables()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Não foi possível salvar a linha.'
      setRowError(msg)
    }
  }

  async function handleRunSql() {
    if (!sqlQuery.trim()) return
    setSqlRunning(true)
    setSqlError('')
    setSqlResult(null)
    try {
      setSqlResult(await AdminService.runSql(sqlQuery))
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Erro ao executar a query.'
      setSqlError(msg)
    } finally {
      setSqlRunning(false)
    }
  }

  const rowColumns = useMemo(() => {
    const first = tableRows[0]
    if (!first) return []
    return Object.keys(first)
  }, [tableRows])

  const rowHint = useMemo(() => {
    const base = 'Campos disponíveis: '
    if (rowColumns.length === 0) return 'Sem dados ainda — informe as colunas no JSON (ex.: {"title": "valor"}).'
    return base + rowColumns.join(', ')
  }, [rowColumns])

  const paginatedUsers = useMemo(() => {
    const start = (usersPage - 1) * USERS_PER_PAGE
    return users.slice(start, start + USERS_PER_PAGE)
  }, [users, usersPage])

  const totalUsersPages = Math.max(1, Math.ceil(users.length / USERS_PER_PAGE))
  const paginationPages = buildPages(usersPage, totalUsersPages)
  const firstUserIndex = users.length === 0 ? 0 : (usersPage - 1) * USERS_PER_PAGE + 1
  const lastUserIndex = Math.min(usersPage * USERS_PER_PAGE, users.length)

  if (checkingAccess) {
    return (
      <div className="flex items-center justify-center py-24">
        <RefreshCw size={28} className="animate-spin text-[var(--color-text-secondary)]" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <EmptyState
        icon={<ShieldOff size={48} />}
        title="Acesso negado"
        description="Esta área é restrita. Entre com uma conta listada em ADMIN_EMAILS no servidor."
      />
    )
  }

  const orgOptions = orgs.map((o) => ({ value: o.id, label: o.name }))

  return (
    <div>
      <div className="flex gap-1 border-b border-[var(--color-card-border)] mb-6 overflow-x-auto">
        {TABS.map((t) => {
          const isActive = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 px-[18px] py-[11px] -mb-px border-b-2 text-[14px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'text-[var(--color-brand-hover)] border-[var(--color-brand)]'
                  : 'text-[var(--muted)] border-transparent hover:text-[var(--color-text-primary)]'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          )
        })}
      </div>

      {tab === 'overview' && (
        <div>
          {statsError ? (
            <ErrorStateInline message={statsError} onRetry={loadStats} />
          ) : !stats ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw size={24} className="animate-spin text-[var(--color-text-secondary)]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Usuários" value={stats.User} />
              <StatCard label="Organizações" value={stats.Organization} />
              <StatCard label="Quadros" value={stats.Board} />
              <StatCard label="Tarefas" value={stats.Task} />
              <StatCard label="Equipes" value={stats.Team} />
              <StatCard label="Membros" value={stats.TeamMember} />
              <StatCard label="Comentários" value={stats.Comment} />
              <StatCard label="Notificações" value={stats.Notification} />
            </div>
          )}
        </div>
      )}

      {tab === 'users' && (
        <div>
          <p className="text-[13px] text-[var(--muted)] mb-[14px]">Criar, editar, excluir e resetar senha de usuários.</p>
          <div className="flex justify-end mb-[14px]">
            <Button variant="primary" size="sm" iconLeft={<Plus size={14} />} onClick={openCreateUser}>
              Novo Usuário
            </Button>
          </div>
          <Card border padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[11px] font-bold uppercase tracking-[0.8px] text-[var(--muted-soft)]">
                    <th className={`${thClass} text-left`}>Nome</th>
                    <th className={`${thClass} text-left`}>Email</th>
                    <th className={`${thClass} text-left`}>Cargo</th>
                    <th className={`${thClass} text-left`}>Organização</th>
                    <th className={`${thClass} text-right`}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usersLoading ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-[var(--muted-soft)]">
                        Carregando...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-[var(--muted-soft)]">
                        Nenhum usuário encontrado.
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((u) => (
                      <tr key={u.id} className={rowHoverClass}>
                        <td className={`${tdClass} font-semibold text-[var(--color-text-primary)]`}>{u.name}</td>
                        <td className={`${tdClass} text-[var(--color-text-secondary)]`}>{u.email}</td>
                        <td className={tdClass}>
                          <RoleBadge role={u.role} />
                        </td>
                        <td className={`${tdClass} text-[var(--color-text-secondary)]`}>{u.organizationName}</td>
                        <td className={tdClass}>
                          <div className="flex items-center justify-end gap-1">
                            <IconButton label="Editar" onClick={() => openEditUser(u)}>
                              <Pencil size={14} />
                            </IconButton>
                            <IconButton label="Resetar senha" onClick={() => { setResetUser(u); setResetPassword('') }}>
                              <KeyRound size={14} />
                            </IconButton>
                            <IconButton label="Excluir" danger onClick={() => setDeleteTarget({ kind: 'user', id: u.id, name: u.name })}>
                              <Trash2 size={14} />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {users.length > USERS_PER_PAGE && (
              <div className="flex items-center justify-between gap-[10px] flex-wrap px-5 py-[14px] border-t border-[var(--color-card-border)]">
                <span className="text-[12.5px] text-[var(--muted-soft)]">
                  Exibindo {firstUserIndex}–{lastUserIndex} de {users.length} usuários
                </span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setUsersPage(Math.max(1, usersPage - 1))}
                    disabled={usersPage <= 1}
                    aria-label="Página anterior"
                    className={`${pagBtnClass} disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {paginationPages.map((p, idx) =>
                    p === 'dots' ? (
                      <span key={`dots-${idx}`} className="min-w-[32px] h-8 flex items-center justify-center text-[13px] text-[var(--muted-soft)]">
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setUsersPage(p)}
                        aria-current={p === usersPage ? 'page' : undefined}
                        className={`${pagBtnClass} ${p === usersPage ? pagBtnActive : ''}`}
                      >
                        {p}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() => setUsersPage(Math.min(totalUsersPages, usersPage + 1))}
                    disabled={usersPage >= totalUsersPages}
                    aria-label="Próxima página"
                    className={`${pagBtnClass} disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {tab === 'orgs' && (
        <div>
          <p className="text-[13px] text-[var(--muted)] mb-[14px]">Organizações que agrupam usuários, quadros e equipes.</p>
          <div className="flex justify-end mb-[14px]">
            <Button variant="primary" size="sm" iconLeft={<Plus size={14} />} onClick={openCreateOrg}>
              Nova Organização
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {orgs.map((o) => (
              <Card key={o.id} border className="p-5">
                <div className="min-w-0">
                  <h3 className="text-[15px] font-bold text-[var(--color-text-primary)] truncate">{o.name}</h3>
                  <p className="text-[12.5px] text-[var(--muted-soft)] mb-[14px] mt-1">
                    {o._count.users} usuários · {o._count.boards} quadros · {o._count.teams} equipes
                  </p>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" iconLeft={<Pencil size={14} />} onClick={() => openEditOrg(o)}>
                      Editar
                    </Button>
                    <Button variant="danger" size="sm" iconLeft={<Trash2 size={14} />} onClick={() => setDeleteTarget({ kind: 'org', id: o.id, name: o.name })}>
                      Excluir
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === 'db' && (
        <div className="space-y-6">
          <Card border className="p-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3 min-w-[260px] flex-1">
                <Select
                  label="Tabela"
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  options={tables.map((t) => ({ value: t.name, label: `${t.name} (${t.rows})` }))}
                />
              </div>
              <div className="flex items-center gap-2 mt-5">
                <Button variant="secondary" size="sm" iconLeft={<RefreshCw size={14} />} onClick={loadTableRows}>
                  Atualizar
                </Button>
                <Button variant="primary" size="sm" iconLeft={<Plus size={14} />} onClick={openCreateRow}>
                  Nova Linha
                </Button>
              </div>
            </div>
            <p className="text-[13px] text-[var(--muted)] mt-2">
              {tableTotal} linha(s) — exibindo até 200.
            </p>
          </Card>

          <Card border padding="none" className="overflow-hidden">
            <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
              {tableLoading ? (
                <div className="flex items-center justify-center py-16">
                  <RefreshCw size={24} className="animate-spin text-[var(--color-text-secondary)]" />
                </div>
              ) : tableRows.length === 0 ? (
                <p className="py-10 text-center text-[var(--muted-soft)] text-size-body-small">Nenhuma linha encontrada.</p>
              ) : (
                <table className="w-full text-left text-size-body-small border-collapse">
                  <thead className="sticky top-0">
                    <tr className="text-[11px] font-bold uppercase tracking-[0.8px] text-[var(--muted-soft)]">
                      {rowColumns.map((col) => (
                        <th key={col} className={`${thClass} whitespace-nowrap`}>{col}</th>
                      ))}
                      <th className={`${thClass} text-right`}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row) => (
                      <tr key={String(row.id)} className={rowHoverClass}>
                        {rowColumns.map((col) => (
                          <td key={col} className={`${tdClass} text-[var(--color-text-secondary)] whitespace-nowrap`}>
                            {formatCell(row[col])}
                          </td>
                        ))}
                        <td className={tdClass}>
                          <div className="flex items-center justify-end gap-1">
                            <IconButton label="Editar" onClick={() => openEditRow(row)}>
                              <Pencil size={14} />
                            </IconButton>
                            <IconButton label="Excluir" danger onClick={() => setDeleteTarget({ kind: 'row', table: selectedTable, id: String(row.id), name: String(row.id) })}>
                              <Trash2 size={14} />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>

          <Card border className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="flex items-center gap-2 text-size-h6 font-semibold text-[var(--color-text-primary)]">
                <Terminal size={16} className="text-[var(--muted-soft)]" />
                Console SQL
              </h3>
              <span className="flex items-center gap-1 text-size-caption text-[var(--color-warning)]">
                <AlertTriangle size={14} />
                Executa comandos crus no banco
              </span>
            </div>
            <textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              rows={3}
              spellCheck={false}
              placeholder="SELECT * FROM users LIMIT 50;"
              className="w-full px-[14px] py-[11px] rounded-[10px] border border-[var(--color-card-border)] bg-[var(--color-bg-input)] text-size-body-small font-mono resize-y focus:outline-none focus:border-[var(--color-focus-ring)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-focus-ring)_18%,transparent)]"
            />
            <div className="flex justify-end mt-3">
              <Button variant="primary" size="md" iconLeft={<Play size={16} />} onClick={handleRunSql} loading={sqlRunning}>
                Executar
              </Button>
            </div>
            {sqlError && <p className="mt-3 text-size-body-small text-[var(--color-danger)]">{sqlError}</p>}
            {sqlResult && (
              <div className="mt-4">
                {sqlResult.readOnly ? (
                  <div className="overflow-x-auto max-h-[320px] overflow-y-auto rounded-[var(--radius-md)] border border-[var(--color-card-border)]">
                    {!sqlResult.rows || sqlResult.rows.length === 0 ? (
                      <p className="py-8 text-center text-[var(--muted-soft)] text-size-body-small">Nenhuma linha retornada.</p>
                    ) : (
                      <table className="w-full text-left text-size-body-small border-collapse">
                        <thead className="sticky top-0">
                          <tr className="text-[11px] font-bold uppercase tracking-[0.8px] text-[var(--muted-soft)]">
                            {Object.keys(sqlResult.rows[0] ?? {}).map((col) => (
                              <th key={col} className={`${thClass} whitespace-nowrap`}>{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sqlResult.rows.map((row, i) => (
                            <tr key={i} className={rowHoverClass}>
                              {Object.keys(row).map((col) => (
                                <td key={col} className={`${tdClass} text-[var(--color-text-secondary)] whitespace-nowrap`}>{formatCell(row[col])}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                ) : (
                  <p className="text-size-body-small text-[var(--color-success)]">
                    Query executada — {sqlResult.rowCount ?? 0} linha(s) afetada(s).
                  </p>
                )}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* User modal */}
      <Modal open={userModalOpen} onClose={() => { setUserModalOpen(false); setEditingUser(null) }} title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}>
        <div className="space-y-4">
          <Input label="Nome" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} placeholder="Nome completo" />
          <Input label="Email" type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} placeholder="email@escola.edu" />
          <Input
            label={editingUser ? 'Nova senha (opcional)' : 'Senha'}
            type="password"
            value={userForm.password}
            onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
            placeholder={editingUser ? 'Deixe em branco para manter' : 'Mínimo 6 caracteres'}
          />
          <Input label="Cargo" value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })} placeholder="Professor" />
          <Select
            label="Organização"
            value={userForm.organizationId}
            onChange={(e) => setUserForm({ ...userForm, organizationId: e.target.value })}
            options={orgOptions}
          />
        </div>
        <div className="flex justify-end gap-3 mt-6" slot="footer">
          <Button variant="ghost" size="md" onClick={() => setUserModalOpen(false)}>Cancelar</Button>
          <Button variant="primary" size="md" onClick={handleSaveUser} disabled={!userForm.name.trim() || !userForm.email.trim()}>
            {editingUser ? 'Salvar' : 'Criar'}
          </Button>
        </div>
      </Modal>

      {/* Reset password modal */}
      <Modal open={!!resetUser} onClose={() => setResetUser(null)} title="Resetar Senha" size="sm">
        <div className="space-y-4">
          <p className="text-size-body-small text-[var(--color-text-secondary)]">Nova senha para <strong>{resetUser?.name}</strong>:</p>
          <Input
            type="password"
            label="Nova senha"
            value={resetPassword}
            onChange={(e) => setResetPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
          />
        </div>
        <div className="flex justify-end gap-3 mt-6" slot="footer">
          <Button variant="ghost" size="md" onClick={() => setResetUser(null)}>Cancelar</Button>
          <Button variant="primary" size="md" onClick={handleResetPassword} disabled={resetPassword.length < 6}>Redefinir</Button>
        </div>
      </Modal>

      {/* Org modal */}
      <Modal open={orgModalOpen} onClose={() => { setOrgModalOpen(false); setEditingOrg(null) }} title={editingOrg ? 'Editar Organização' : 'Nova Organização'} size="sm">
        <div className="space-y-4">
          <Input label="Nome" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Nome da organização" />
        </div>
        <div className="flex justify-end gap-3 mt-6" slot="footer">
          <Button variant="ghost" size="md" onClick={() => setOrgModalOpen(false)}>Cancelar</Button>
          <Button variant="primary" size="md" onClick={handleSaveOrg} disabled={!orgName.trim()}>{editingOrg ? 'Salvar' : 'Criar'}</Button>
        </div>
      </Modal>

      {/* Row JSON modal */}
      <Modal open={rowModalOpen} onClose={() => { setRowModalOpen(false); setEditingRow(null) }} title={editingRow ? `Editar linha ${selectedTable}` : `Nova linha ${selectedTable}`} size="lg">
        <div className="space-y-4">
          <p className="text-size-caption text-[var(--color-text-secondary)]">{rowHint}</p>
          <textarea
            value={rowJson}
            onChange={(e) => setRowJson(e.target.value)}
            rows={10}
            spellCheck={false}
            className="w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--gray-300)] bg-[var(--color-bg-input)] text-size-body-small font-mono resize-y focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-900)]"
          />
          {rowError && <p className="text-size-body-small text-[var(--color-danger)]">{rowError}</p>}
        </div>
        <div className="flex justify-end gap-3 mt-6" slot="footer">
          <Button variant="ghost" size="md" onClick={() => setRowModalOpen(false)}>Cancelar</Button>
          <Button variant="primary" size="md" onClick={handleSaveRow}>{editingRow ? 'Salvar' : 'Criar'}</Button>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirmar exclusão" size="sm">
        <p className="text-size-body-small text-[var(--color-text-secondary)]">
          Tem certeza que deseja excluir <strong>{deleteTarget?.name}</strong>?
          {deleteTarget?.kind === 'org' && ' Isso apagará usuários, quadros e equipes vinculados (cascata).'}
          {deleteTarget?.kind === 'user' && ' Comentários, anexos e notificações vinculados serão removidos.'}
        </p>
        <div className="flex justify-end gap-3 mt-6" slot="footer">
          <Button variant="ghost" size="md" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
          <Button variant="danger" size="md" onClick={handleDelete} loading={deleting}>Excluir</Button>
        </div>
      </Modal>
    </div>
  )
}

const pagBtnClass =
  'flex items-center justify-center min-w-[32px] h-8 px-2 rounded-[8px] border border-[var(--color-card-border)] bg-[var(--color-bg-surface)] text-[var(--muted)] text-[13px] font-semibold cursor-pointer transition-colors hover:border-[var(--color-brand)] hover:text-[var(--color-brand-hover)]'

const pagBtnActive = 'bg-[var(--color-brand)] text-[var(--color-brand-ink)] border-[var(--color-brand)] hover:text-[var(--color-brand-ink)]'

function IconButton({
  children,
  label,
  onClick,
  danger,
}: {
  children: ReactNode
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`w-[30px] h-[30px] flex items-center justify-center rounded-[8px] border border-[var(--color-card-border)] bg-[var(--color-bg-surface)] text-[var(--muted)] hover:text-[var(--color-text-primary)] cursor-pointer transition-colors ${
        danger ? 'hover:text-[var(--color-danger)] hover:border-[var(--color-danger-bg)] hover:bg-[var(--color-danger-bg)]' : ''
      }`}
    >
      {children}
    </button>
  )
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function ErrorStateInline({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertTriangle size={28} className="text-[var(--color-danger)] mb-3" />
      <p className="text-size-body-small text-[var(--color-text-secondary)] mb-4">{message}</p>
      <Button variant="primary" size="md" onClick={onRetry}>Tentar novamente</Button>
    </div>
  )
}
