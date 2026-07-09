import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Users, UserPlus, X } from 'lucide-react'
import { PageHeader } from '../../shared/components/PageHeader'
import { Button } from '../../shared/components/Button'
import { Card } from '../../shared/components/Card'
import { Avatar } from '../../shared/components/Avatar'
import { EmptyState } from '../../shared/components/EmptyState'
import { ErrorState } from '../../shared/components/ErrorState'
import { Modal } from '../../shared/components/Modal'
import { useTeamStore } from '../../stores/domain/teamStore'
import type { Team } from '../../types'

export default function TeamsPage() {
  const { teams, loading, error, loadTeams, addTeam, updateTeam, deleteTeam, addMember, removeMember } = useTeamStore()
  const [formOpen, setFormOpen] = useState(false)
  const [memberOpen, setMemberOpen] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [form, setForm] = useState({ name: '', description: '' })
  const [memberForm, setMemberForm] = useState({ name: '', email: '', role: '' })
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => { loadTeams() }, [loadTeams])

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
    if (!memberOpen || !memberForm.name.trim()) return
    await addMember(memberOpen, memberForm)
    setMemberForm({ name: '', email: '', role: '' })
  }

  if (error) return <ErrorState title="Erro" description={error} onRetry={loadTeams} />

  return (
    <div>
      <PageHeader
        title="Equipes"
        description="Gerencie as equipes pedagógicas"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teams.map((team) => (
            <Card key={team.id} border hover className="group">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-size-h6 font-semibold text-[var(--color-text-primary)] truncate">{team.name}</h3>
                    {team.members && <span className="text-size-caption text-[var(--color-text-secondary)] shrink-0">{team.members.length} membros</span>}
                  </div>
                  {team.description && <p className="text-size-body-small text-[var(--color-text-secondary)] mb-4">{team.description}</p>}

                  {/* Members avatars */}
                  <div className="flex items-center gap-1 mb-4">
                    {team.members?.slice(0, 5).map((m) => (
                      <Avatar key={m.id} name={m.name} size="sm" />
                    ))}
                    {team.members && team.members.length > 5 && (
                      <span className="text-size-caption text-[var(--color-text-secondary)] ml-1">+{team.members.length - 5}</span>
                    )}
                    <button
                      onClick={() => { setMemberOpen(team.id); setExpandedId(team.id) }}
                      className="ml-2 p-1.5 rounded-[var(--radius-sm)] text-[var(--gray-400)] hover:text-[var(--color-primary-600)] hover:bg-[var(--color-primary-50)] cursor-pointer"
                      aria-label="Adicionar membro"
                    >
                      <UserPlus size={16} />
                    </button>
                  </div>

                  {/* Expand members */}
                  {expandedId === team.id && team.members && team.members.length > 0 && (
                    <div className="space-y-2 mb-4 p-3 bg-[var(--gray-50)] rounded-[var(--radius-md)]">
                      {team.members.map((m) => (
                        <div key={m.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar name={m.name} size="sm" />
                            <div>
                              <p className="text-size-body-small font-medium text-[var(--color-text-primary)]">{m.name}</p>
                              <p className="text-size-caption text-[var(--color-text-secondary)]">{m.role || m.email}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeMember(team.id, m.id)}
                            className="p-1 rounded text-[var(--gray-400)] hover:text-[var(--color-danger-600)] cursor-pointer"
                            aria-label="Remover membro"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 opacity-0 pointer-events-none transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 group-hover:pointer-events-auto group-focus-within:pointer-events-auto shrink-0 ml-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); openEdit(team) }}
                    className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] border border-[var(--gray-200)] bg-[var(--color-bg-surface)] text-[var(--gray-500)] hover:text-[var(--color-primary-600)] hover:border-[var(--color-primary-300)] cursor-pointer transition-colors shadow-[var(--shadow-xs)]"
                    aria-label="Editar equipe"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirm(team.id) }}
                    className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] border border-[var(--gray-200)] bg-[var(--color-bg-surface)] text-[var(--gray-500)] hover:text-[var(--color-danger-600)] hover:border-[var(--color-danger-300)] cursor-pointer transition-colors shadow-[var(--shadow-xs)]"
                    aria-label="Excluir equipe"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Expand toggle */}
              {team.members && team.members.length > 0 && (
                <button
                  onClick={() => setExpandedId(expandedId === team.id ? null : team.id)}
                  className="text-size-caption text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] cursor-pointer mt-2 font-medium"
                >
                  {expandedId === team.id ? 'Recolher membros' : `Ver ${team.members.length} membros`}
                </button>
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
      <Modal open={!!memberOpen} onClose={() => setMemberOpen(null)} title="Adicionar Membro" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-size-body-small font-medium text-[var(--gray-700)] mb-1.5">Nome</label>
            <input value={memberForm.name} onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })} placeholder="Nome do membro" className="w-full h-11 px-3 rounded-[var(--radius-md)] border border-[var(--gray-300)] bg-[var(--color-bg-input)] text-size-body-small focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-900)]" autoFocus />
          </div>
          <div>
            <label className="block text-size-body-small font-medium text-[var(--gray-700)] mb-1.5">Email</label>
            <input value={memberForm.email} onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })} placeholder="email@exemplo.com" className="w-full h-11 px-3 rounded-[var(--radius-md)] border border-[var(--gray-300)] bg-[var(--color-bg-input)] text-size-body-small focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-900)]" />
          </div>
          <div>
            <label className="block text-size-body-small font-medium text-[var(--gray-700)] mb-1.5">Função</label>
            <input value={memberForm.role} onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })} placeholder="Professor, Coordenador..." className="w-full h-11 px-3 rounded-[var(--radius-md)] border border-[var(--gray-300)] bg-[var(--color-bg-input)] text-size-body-small focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-900)]" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6" slot="footer">
          <Button variant="ghost" size="md" onClick={() => setMemberOpen(null)}>Cancelar</Button>
          <Button variant="primary" size="md" onClick={handleAddMember} disabled={!memberForm.name.trim()}>Adicionar</Button>
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
