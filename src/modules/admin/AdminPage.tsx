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
} from 'lucide-react'
import { PageHeader } from '../../shared/components/PageHeader'
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

function StatCard({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  return (
    <Card border className="p-5">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-[var(--radius-md)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)] flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-size-h4 font-bold text-[var(--color-text-primary)]">{value}</p>
          <p className="text-size-caption text-[var(--color-text-secondary)]">{label}</p>
        </div>
      </div>
    </Card>
  )
}

export default function AdminPage() {
  const addToast = useUIStore((s) => s.addToast)
  const [checkingAccess, setCheckingAccess] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [tab, setTab] = useState<TabId>('overview')

  const [stats, setStats] = useState<AdminStats | null>(null)
  const [statsError, setStatsError] = useState('')

  const [users, setUsers] = useState<AdminUser[]>([])
  const [usersLoading, setUsersLoading] = useState(false)

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
      <PageHeader title="Admin" description="Gerenciamento direto do banco de dados" />

      <div className="flex items-center gap-2 mb-8 border-b border-[var(--gray-200)] overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-3 text-size-body-small font-medium border-b-2 -mb-px transition-colors cursor-pointer whitespace-nowrap ${
              tab === t.id
                ? 'border-[var(--color-primary-600)] text-[var(--color-primary-700)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Usuários" value={stats.User} icon={<Users size={20} />} />
              <StatCard label="Organizações" value={stats.Organization} icon={<Building2 size={20} />} />
              <StatCard label="Quadros" value={stats.Board} icon={<Database size={20} />} />
              <StatCard label="Tarefas" value={stats.Task} icon={<LayoutDashboard size={20} />} />
              <StatCard label="Equipes" value={stats.Team} icon={<Users size={20} />} />
              <StatCard label="Membros" value={stats.TeamMember} icon={<Users size={20} />} />
              <StatCard label="Comentários" value={stats.Comment} icon={<Database size={20} />} />
              <StatCard label="Notificações" value={stats.Notification} icon={<Database size={20} />} />
            </div>
          )}
        </div>
      )}

      {tab === 'users' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-size-body-small text-[var(--color-text-secondary)]">Criar, editar, excluir e resetar senha de usuários.</p>
            <Button variant="primary" size="md" iconLeft={<Plus size={16} />} onClick={openCreateUser}>
              Novo Usuário
            </Button>
          </div>
          <Card border className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[var(--gray-50)] text-size-caption text-[var(--gray-500)] uppercase">
                    <th className="px-4 py-3 font-medium">Nome</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Cargo</th>
                    <th className="px-4 py-3 font-medium">Organização</th>
                    <th className="px-4 py-3 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usersLoading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-[var(--gray-400)]">
                        Carregando...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-[var(--gray-400)]">
                        Nenhum usuário encontrado.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="border-t border-[var(--gray-100)] hover:bg-[var(--gray-50)]">
                        <td className="px-4 py-3 text-size-body-small font-medium text-[var(--gray-800)]">{u.name}</td>
                        <td className="px-4 py-3 text-size-body-small text-[var(--gray-600)]">{u.email}</td>
                        <td className="px-4 py-3 text-size-body-small text-[var(--gray-600)]">{u.role}</td>
                        <td className="px-4 py-3 text-size-body-small text-[var(--gray-600)]">{u.organizationName}</td>
                        <td className="px-4 py-3">
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
          </Card>
        </div>
      )}

      {tab === 'orgs' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-size-body-small text-[var(--color-text-secondary)]">Organizações que agrupam usuários, quadros e equipes.</p>
            <Button variant="primary" size="md" iconLeft={<Plus size={16} />} onClick={openCreateOrg}>
              Nova Organização
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orgs.map((o) => (
              <Card key={o.id} border hover className="p-5">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <h3 className="text-size-h6 font-semibold text-[var(--color-text-primary)] truncate">{o.name}</h3>
                    <p className="text-size-caption text-[var(--color-text-secondary)] mt-1">
                      {o._count.users} usuários · {o._count.boards} quadros · {o._count.teams} equipes
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <IconButton label="Editar" onClick={() => openEditOrg(o)}>
                      <Pencil size={14} />
                    </IconButton>
                    <IconButton label="Excluir" danger onClick={() => setDeleteTarget({ kind: 'org', id: o.id, name: o.name })}>
                      <Trash2 size={14} />
                    </IconButton>
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
                <Button variant="secondary" size="md" iconLeft={<RefreshCw size={16} />} onClick={loadTableRows}>
                  Atualizar
                </Button>
                <Button variant="primary" size="md" iconLeft={<Plus size={16} />} onClick={openCreateRow}>
                  Nova Linha
                </Button>
              </div>
            </div>
            <p className="text-size-caption text-[var(--color-text-secondary)] mt-2">
              {tableTotal} linha(s) — exibindo até 200.
            </p>
          </Card>

          <Card border className="overflow-hidden">
            <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
              {tableLoading ? (
                <div className="flex items-center justify-center py-16">
                  <RefreshCw size={24} className="animate-spin text-[var(--color-text-secondary)]" />
                </div>
              ) : tableRows.length === 0 ? (
                <p className="py-10 text-center text-[var(--gray-400)] text-size-body-small">Nenhuma linha encontrada.</p>
              ) : (
                <table className="w-full text-left text-size-body-small">
                  <thead className="sticky top-0">
                    <tr className="bg-[var(--gray-100)] text-size-caption text-[var(--gray-500)] uppercase">
                      {rowColumns.map((col) => (
                        <th key={col} className="px-4 py-3 font-medium whitespace-nowrap">{col}</th>
                      ))}
                      <th className="px-4 py-3 font-medium text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row) => (
                      <tr key={String(row.id)} className="border-t border-[var(--gray-100)] hover:bg-[var(--gray-50)]">
                        {rowColumns.map((col) => (
                          <td key={col} className="px-4 py-3 text-[var(--gray-700)] whitespace-nowrap">
                            {formatCell(row[col])}
                          </td>
                        ))}
                        <td className="px-4 py-3">
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
              <h3 className="text-size-h6 font-semibold text-[var(--color-text-primary)]">Console SQL</h3>
              <span className="flex items-center gap-1 text-size-caption text-[var(--color-danger-600)]">
                <AlertTriangle size={14} />
                Executa comandos crus no banco
              </span>
            </div>
            <textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              rows={5}
              spellCheck={false}
              placeholder="SELECT * FROM users LIMIT 50;"
              className="w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--gray-300)] bg-[var(--color-bg-input)] text-size-body-small font-mono resize-y focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-900)]"
            />
            <div className="flex justify-end mt-3">
              <Button variant="primary" size="md" iconLeft={<Play size={16} />} onClick={handleRunSql} loading={sqlRunning}>
                Executar
              </Button>
            </div>
            {sqlError && <p className="mt-3 text-size-body-small text-[var(--color-danger-600)]">{sqlError}</p>}
            {sqlResult && (
              <div className="mt-4">
                {sqlResult.readOnly ? (
                  <div className="overflow-x-auto max-h-[320px] overflow-y-auto rounded-[var(--radius-md)] border border-[var(--gray-200)]">
                    {!sqlResult.rows || sqlResult.rows.length === 0 ? (
                      <p className="py-8 text-center text-[var(--gray-400)] text-size-body-small">Nenhuma linha retornada.</p>
                    ) : (
                      <table className="w-full text-left text-size-body-small">
                        <thead className="sticky top-0">
                          <tr className="bg-[var(--gray-100)] text-size-caption text-[var(--gray-500)] uppercase">
                            {Object.keys(sqlResult.rows[0] ?? {}).map((col) => (
                              <th key={col} className="px-4 py-3 font-medium whitespace-nowrap">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sqlResult.rows.map((row, i) => (
                            <tr key={i} className="border-t border-[var(--gray-100)]">
                              {Object.keys(row).map((col) => (
                                <td key={col} className="px-4 py-3 text-[var(--gray-700)] whitespace-nowrap">{formatCell(row[col])}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                ) : (
                  <p className="text-size-body-small text-[var(--color-success-700)]">
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
          {rowError && <p className="text-size-body-small text-[var(--color-danger-600)]">{rowError}</p>}
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
      className={`w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] border border-[var(--gray-200)] bg-[var(--color-bg-surface)] text-[var(--gray-500)] hover:text-[var(--color-primary-600)] hover:border-[var(--color-primary-300)] cursor-pointer transition-colors shadow-[var(--shadow-xs)] ${
        danger ? 'hover:text-[var(--color-danger-600)] hover:border-[var(--color-danger-300)]' : ''
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
      <AlertTriangle size={28} className="text-[var(--color-danger-600)] mb-3" />
      <p className="text-size-body-small text-[var(--gray-600)] mb-4">{message}</p>
      <Button variant="primary" size="md" onClick={onRetry}>Tentar novamente</Button>
    </div>
  )
}
