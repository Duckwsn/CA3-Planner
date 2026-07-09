import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, Columns3 } from 'lucide-react'
import { PageHeader } from '../../shared/components/PageHeader'
import { Button } from '../../shared/components/Button'
import { Card } from '../../shared/components/Card'
import { EmptyState } from '../../shared/components/EmptyState'
import { ErrorState } from '../../shared/components/ErrorState'
import { Modal } from '../../shared/components/Modal'
import { useBoardStore } from '../../stores/domain/boardStore'
import type { Board, BoardFormData } from '../../types'

export default function BoardsPage() {
  const navigate = useNavigate()
  const { boards, loading, error, loadBoards, addBoard, updateBoard, deleteBoard } = useBoardStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [editingBoard, setEditingBoard] = useState<Board | null>(null)
  const [form, setForm] = useState<BoardFormData>({ title: '', description: '', color: '#2563eb' })

  useEffect(() => { loadBoards() }, [loadBoards])

  const BOARD_COLORS = [
    { value: '#2563eb', label: 'Azul' },
    { value: '#059669', label: 'Verde' },
    { value: '#7c3aed', label: 'Roxo' },
    { value: '#ea580c', label: 'Laranja' },
    { value: '#dc2626', label: 'Vermelho' },
    { value: '#0d9488', label: 'Teal' },
    { value: '#db2777', label: 'Rosa' },
    { value: '#4f46e5', label: 'Índigo' },
  ] as const

  function openCreate() {
    setEditingBoard(null)
    setForm({ title: '', description: '', color: '#2563eb' })
    setModalOpen(true)
  }

  function openEdit(board: Board) {
    setEditingBoard(board)
    setForm({ title: board.title, description: board.description, color: board.color })
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.title.trim()) return
    if (editingBoard) {
      await updateBoard(editingBoard.id, form)
    } else {
      await addBoard(form)
    }
    setModalOpen(false)
  }

  async function handleDelete(id: string) {
    await deleteBoard(id)
    setDeleteConfirm(null)
  }

  if (error) return <ErrorState title="Erro" description={error} onRetry={loadBoards} />

  return (
    <div>
      <PageHeader
        title="Quadros"
        description="Gerencie seus quadros pedagógicos"
        actions={
          <Button variant="primary" size="md" iconLeft={<Plus size={16} />} onClick={openCreate}>
            Novo Board
          </Button>
        }
      />

      {boards.length === 0 && !loading ? (
        <EmptyState
          icon={<Columns3 size={48} />}
          title="Nenhum quadro encontrado"
          description="Crie seu primeiro quadro para começar a organizar suas atividades pedagógicas."
          action={<Button variant="primary" size="md" iconLeft={<Plus size={16} />} onClick={openCreate}>Criar Primeiro Quadro</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <Card key={board.id} padding="none" hover border className="overflow-hidden group">
              <div className="h-1.5" style={{ backgroundColor: board.color }} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3
                    className="text-size-h6 font-semibold text-[var(--color-text-primary)] cursor-pointer truncate flex-1"
                    onClick={() => navigate(`/boards/${board.id}`)}
                  >
                    {board.title}
                  </h3>
                  <div className="flex items-center gap-1 opacity-0 pointer-events-none transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 group-hover:pointer-events-auto group-focus-within:pointer-events-auto shrink-0 ml-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); openEdit(board) }}
                      className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] border border-[var(--gray-200)] bg-[var(--color-bg-surface)] text-[var(--gray-500)] hover:text-[var(--color-primary-600)] hover:border-[var(--color-primary-300)] cursor-pointer transition-colors shadow-[var(--shadow-xs)]"
                      aria-label="Editar board"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirm(board.id) }}
                      className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] border border-[var(--gray-200)] bg-[var(--color-bg-surface)] text-[var(--gray-500)] hover:text-[var(--color-danger-600)] hover:border-[var(--color-danger-300)] cursor-pointer transition-colors shadow-[var(--shadow-xs)]"
                      aria-label="Excluir board"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {board.description && (
                  <p className="text-size-body-small text-[var(--color-text-secondary)] mb-3 line-clamp-2">{board.description}</p>
                )}
                <div className="flex items-center gap-2 text-size-caption text-[var(--gray-400)]">
                  <span>{board._count?.tasks ?? 0} tarefas</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingBoard ? 'Editar Board' : 'Novo Board'}>
        <div className="space-y-4">
          <div>
            <label className="block text-size-body-small font-medium text-[var(--gray-700)] mb-1.5">Título</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Nome do board"
              className="w-full h-11 px-3 rounded-[var(--radius-md)] border border-[var(--gray-300)] bg-[var(--color-bg-input)] text-size-body-small focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-900)]"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-size-body-small font-medium text-[var(--gray-700)] mb-1.5">Descrição</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Descrição opcional"
              rows={3}
              className="w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--gray-300)] bg-[var(--color-bg-input)] text-size-body-small resize-y focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-900)]"
            />
          </div>
          <div>
            <label className="block text-size-body-small font-medium text-[var(--gray-700)] mb-1.5">Cor</label>
            <div className="flex gap-2">
              {BOARD_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setForm({ ...form, color: c.value })}
                  className={`w-8 h-8 rounded-[var(--radius-md)] cursor-pointer transition-all ${form.color === c.value ? 'ring-2 ring-offset-2 ring-[var(--gray-900)]' : ''}`}
                  style={{ backgroundColor: c.value }}
                  aria-label={c.label}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6" slot="footer">
          <Button variant="ghost" size="md" onClick={() => setModalOpen(false)}>Cancelar</Button>
          <Button variant="primary" size="md" onClick={handleSave} disabled={!form.title.trim()}>
            {editingBoard ? 'Salvar' : 'Criar'}
          </Button>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Excluir Board" size="sm">
        <p className="text-size-body-small text-[var(--color-text-secondary)]">
          Tem certeza que deseja excluir este board? Esta ação não pode ser desfeita.
        </p>
        <div className="flex justify-end gap-3 mt-6" slot="footer">
          <Button variant="ghost" size="md" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
          <Button variant="danger" size="md" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Excluir</Button>
        </div>
      </Modal>
    </div>
  )
}
