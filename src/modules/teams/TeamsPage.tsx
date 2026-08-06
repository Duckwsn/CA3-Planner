import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Users, ChevronDown, X } from 'lucide-react'
import { PageHeader } from '../../shared/components/PageHeader'
import { Button } from '../../shared/components/Button'
import { Card } from '../../shared/components/Card'
import { Avatar } from '../../shared/components/Avatar'
import { EmptyState } from '../../shared/components/EmptyState'
import { ErrorState } from '../../shared/components/ErrorState'
import { Modal } from '../../shared/components/Modal'
import { Select } from '../../shared/components/Select'
import { useTeamStore } from '../../stores/domain/teamStore'
import { TeamService } from '../../services/TeamService'
import type { Team, User } from '../../types'

export default function TeamsPage() {
  const { teams, loading, error, loadTeams, addTeam, updateTeam, deleteTeam, addMember, removeMember } = useTeamStore()
  const [formOpen, setFormOpen] = useState(false)
  const [memberOpen, setMemberOpen] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [form, setForm] = useState({ name: '', description: '' })
  const [memberUserId, setMemberUserId] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => { loadTeams() }, [loadTeams])

  useEffect(() => {
    TeamService.listUsers().then(setUsers).catch(() => setUsers([]))
  }, [])

  function openCreate() {
    setEditingTeam(null)
    setForm({ name: '', description: '' })
    setFormOpen(true)
  }

  function openEdit(team: Team) {
    setEditingTeam(team)
    setForm({ name: team.name, description: team.description })
    setFormOpen(true)
  }

  async function handleSave() {
    if (!form.name.trim()) return
    if (editingTeam) {
      await updateTeam(editingTeam.id, form)
    } else {
      await addTeam(form)
    }
    setFormOpen(false)
  }

  async function handleAddMember() {
    if (!memberOpen || !memberUserId) return
    await addMember(memberOpen, { userId: memberUserId })
    setMemberUserId('')
  }

  if (error) return <ErrorState title="Erro" description={error} onRetry={loadTeams} />

  return (
    <div>
      <PageHeader
        actions={
          <Button variant="primary" size="md" iconLeft={<Plus size={16} />} onClick={openCreate}>
            Nova Equipe
          </Button>
        }
      />

      {teams.length === 0 && !loading ? (
        <EmptyState
          icon={<Users size={48} />}
          title="Nenhuma equipe encontrada"
          description="Crie sua primeira equipe para começar a organizar os professores."
          action={<Button variant="primary" size="md" iconLeft={<Plus size={16} />} onClick={openCreate}>Criar Equipe</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {teams.map((team) => (
            <Card key={team.id} border>
              <div className="flex items-start justify-between gap-2.5 mb-[6px]">
                <h3 className="text-[16px] font-bold text-[var(--color-text-primary)] truncate">{team.name}</h3>
                {team.members && <span className="text-[12px] text-[var(--muted-soft)] shrink-0">{team.members.length} membros</span>}
              </div>

              {team.description && <p className="text-[13.5px] text-[var(--color-text-secondary)] leading-[1.55] mb-[18px]">{team.description}</p>}

              {/* Members avatars */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {team.members?.slice(0, 5).map((m) => (
                  <Avatar key={m.id} name={m.user?.name ?? m.name} size="sm" className="border-2 border-[var(--color-bg-card)]" />
                ))}
                {team.members && team.members.length > 5 && (
                  <span className="w-8 h-8 rounded-full bg-[var(--color-bg-subtle)] text-[var(--muted)] text-[11px] font-semibold flex items-center justify-center border-2 border-[var(--color-bg-card)]">+{team.members.length - 5}</span>
                )}
                <button
                  onClick={() => { setMemberOpen(team.id); setExpandedId(team.id) }}
                  className="w-8 h-8 rounded-full border-[1.5px] border-dashed border-[var(--muted-soft)] bg-transparent text-[var(--muted-soft)] flex items-center justify-center hover:text-[var(--color-brand-hover)] hover:border-[var(--color-brand)] cursor-pointer transition-colors"
                  aria-label="Adicionar membro"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* team-foot */}
              <div className="flex items-center justify-between border-t border-[var(--color-card-border)] pt-[14px]">
                {team.members && team.members.length > 0 && (
                  <button
                    onClick={() => setExpandedId(expandedId === team.id ? null : team.id)}
                    className="bg-transparent border-none p-0 text-[var(--color-info)] text-[13px] font-semibold inline-flex items-center gap-[6px] cursor-pointer"
                  >
                    <ChevronDown size={14} />
                    {expandedId === team.id ? 'Recolher membros' : `Ver ${team.members.length} membros`}
                  </button>
                )}
                <div className="flex items-center gap-[6px] ml-auto">
                  <button
                    onClick={(e) => { e.stopPropagation(); openEdit(team) }}
                    className="w-[30px] h-[30px] rounded-[8px] border border-[var(--color-card-border)] bg-[var(--color-bg-card)] text-[var(--muted)] flex items-center justify-center hover:text-[var(--color-text-primary)] cursor-pointer transition-colors"
                    aria-label="Editar equipe"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirm(team.id) }}
                    className="w-[30px] h-[30px] rounded-[8px] border border-[var(--color-card-border)] bg-[var(--color-bg-card)] text-[var(--muted)] flex items-center justify-center hover:text-[var(--color-danger)] hover:border-[var(--color-danger-bg)] hover:bg-[var(--color-danger-bg)] cursor-pointer transition-colors"
                    aria-label="Excluir equipe"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Expand members */}
              {expandedId === team.id && team.members && team.members.length > 0 && (
                <div className="mt-[14px] border-t border-[var(--color-card-border)] pt-3 flex flex-col gap-2.5">
                  {team.members.map((m) => (
                    <div key={m.id} className="flex items-center gap-3">
                      <Avatar name={m.user?.name ?? m.name} size="sm" className="border-2 border-[var(--color-bg-card)]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13.5px] font-semibold text-[var(--color-text-primary)] truncate">{m.user?.name ?? m.name}</p>
                        <p className="text-[12px] text-[var(--muted-soft)] truncate">{m.user?.role || m.user?.email || m.role || m.email}</p>
                      </div>
                      <button
                        onClick={() => removeMember(team.id, m.id)}
                        className="p-1 rounded text-[var(--muted-soft)] hover:text-[var(--color-danger-600)] cursor-pointer"
                        aria-label="Remover membro"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Team Form Modal */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editingTeam ? 'Editar Equipe' : 'Nova Equipe'}>
        <div className="space-y-4">
          <div>
            <label className="block text-size-body-small font-medium text-[var(--gray-700)] mb-1.5">Nome</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome da equipe" className="w-full h-11 px-3 rounded-[var(--radius-md)] border border-[var(--gray-300)] bg-[var(--color-bg-input)] text-size-body-small focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-900)]" autoFocus />
          </div>
          <div>
            <label className="block text-size-body-small font-medium text-[var(--gray-700)] mb-1.5">Descrição</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--gray-300)] bg-[var(--color-bg-input)] text-size-body-small resize-y focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-900)]" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6" slot="footer">
          <Button variant="ghost" size="md" onClick={() => setFormOpen(false)}>Cancelar</Button>
          <Button variant="primary" size="md" onClick={handleSave} disabled={!form.name.trim()}>{editingTeam ? 'Salvar' : 'Criar'}</Button>
        </div>
      </Modal>

      {/* Add Member Modal */}
      <Modal open={!!memberOpen} onClose={() => { setMemberOpen(null); setMemberUserId('') }} title="Adicionar Membro" size="sm">
        <div className="space-y-4">
          <Select
            label="Usuário"
            placeholder="Selecione uma conta"
            value={memberUserId}
            onChange={(e) => setMemberUserId(e.target.value)}
            options={users
              .filter((u) => !teams.find((t) => t.id === memberOpen)?.members.some((m) => m.userId === u.id))
              .map((u) => ({ value: u.id, label: `${u.name} · ${u.email}` }))}
          />
          <p className="text-size-caption text-[var(--gray-400)]">
            Apenas contas reais podem ser adicionadas como membros.
          </p>
        </div>
        <div className="flex justify-end gap-3 mt-6" slot="footer">
          <Button variant="ghost" size="md" onClick={() => { setMemberOpen(null); setMemberUserId('') }}>Cancelar</Button>
          <Button variant="primary" size="md" onClick={handleAddMember} disabled={!memberUserId}>Adicionar</Button>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Excluir Equipe" size="sm">
        <p className="text-size-body-small text-[var(--color-text-secondary)]">Tem certeza que deseja excluir esta equipe?</p>
        <div className="flex justify-end gap-3 mt-6" slot="footer">
          <Button variant="ghost" size="md" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
          <Button variant="danger" size="md" onClick={async () => { if (deleteConfirm) { await deleteTeam(deleteConfirm); setDeleteConfirm(null) } }}>Excluir</Button>
        </div>
      </Modal>
    </div>
  )
}
