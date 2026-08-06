import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../../shared/components/Button'
import { Modal } from '../../shared/components/Modal'
import { LoadingState } from '../../shared/components/LoadingState'
import { ErrorState } from '../../shared/components/ErrorState'
import { Badge } from '../../shared/components/Badge'
import { getPriorityLabel, getPriorityVariant } from '../../types/task.types'
import { apiGet } from '../../core/api/httpClient'
import { TaskService } from '../../services/TaskService'
import type { Task } from '../../types'

interface ArchivedTask extends Task {
  board: { title: string; color: string }
}

export default function ArchivedTasksPage() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<ArchivedTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<ArchivedTask | null>(null)
  const [restoring, setRestoring] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    apiGet<ArchivedTask[]>('/tasks/archived')
      .then(setTasks)
      .catch(() => setError('Erro ao carregar tarefas arquivadas'))
      .finally(() => setLoading(false))
  }, [])

  async function handleRestore(taskId: string) {
    setRestoring(true)
    try {
      await TaskService.unarchive(taskId)
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
      setSelectedTask(null)
    } catch {
      setError('Erro ao retornar a tarefa')
    } finally {
      setRestoring(false)
    }
  }

  async function handleDelete(taskId: string) {
    setDeleting(true)
    try {
      await TaskService.remove(taskId)
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
      setSelectedTask(null)
      setConfirmDelete(false)
    } catch {
      setError('Erro ao excluir a tarefa')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <LoadingState message="Carregando tarefas arquivadas..." />
  if (error) return <ErrorState title="Erro" description={error} onRetry={() => window.location.reload()} />

  const priorityOrder = ['urgent', 'high', 'medium', 'low']

  const grouped = tasks.reduce<Record<string, ArchivedTask[]>>((acc, t) => {
    const key = t.priority
    if (!acc[key]) acc[key] = []
    acc[key].push(t)
    return acc
  }, {})

  const categories = priorityOrder.filter((c) => grouped[c])

  return (
    <div>
      <div className="flex items-center gap-3.5 mb-6 flex-wrap">
        <Button variant="secondary" size="sm" iconLeft={<ArrowLeft size={16} />} onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-size-body-small text-[var(--gray-500)]">Nenhuma tarefa arquivada.</p>
      ) : (
        categories.map((cat) => {
          const catTasks = grouped[cat]!
          return (
          <div key={cat} className="mb-7">
            <div className="flex items-center gap-2.5 mb-3">
              <Badge variant={getPriorityVariant(cat as any)}>{getPriorityLabel(cat as any)}</Badge>
              <span className="text-[13px] text-[var(--muted-soft)] tabular-nums">
                {catTasks.length} {catTasks.length === 1 ? 'tarefa' : 'tarefas'}
              </span>
            </div>
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-card-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] overflow-hidden">
              {catTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTask(t)}
                  className="flex items-center justify-between gap-4 px-5 py-[14px] border-b border-[var(--color-card-border)] last:border-b-0 cursor-pointer hover:bg-[var(--color-bg-subtle)] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-size-body-small font-semibold text-[var(--color-text-primary)] truncate">{t.title}</p>
                    <p className="text-[12.5px] text-[var(--muted-soft)] mt-0.5">
                      {t.board.title} {t.assignee ? `• ${t.assignee}` : ''}
                    </p>
                  </div>
                  <span className="text-[12.5px] text-[var(--muted)] whitespace-nowrap shrink-0 ml-4">
                    {t.archivedAt ? `Arquivada em ${new Date(t.archivedAt).toLocaleDateString('pt-BR')}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
          )
        })
      )}

      <Modal
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.title ?? ''}
        size="md"
        footer={
          <div className="flex justify-between items-center w-full">
            <Button variant="danger" onClick={() => setConfirmDelete(true)}>
              Excluir permanentemente
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setSelectedTask(null)}>
                Fechar
              </Button>
              <Button
                variant="primary"
                loading={restoring}
                onClick={() => selectedTask && handleRestore(selectedTask.id)}
              >
                Retornar tarefa
              </Button>
            </div>
          </div>
        }
      >
        {selectedTask && (
          <div className="space-y-3 text-size-body-small">
            <div className="flex items-center gap-2">
              <Badge variant={getPriorityVariant(selectedTask.priority)}>
                {getPriorityLabel(selectedTask.priority)}
              </Badge>
              <span className="text-[var(--gray-500)]">{selectedTask.board.title}</span>
            </div>
            {selectedTask.description && (
              <p className="text-[var(--gray-700)] whitespace-pre-wrap">{selectedTask.description}</p>
            )}
            <div className="grid grid-cols-2 gap-2 text-[var(--gray-500)] pt-2 border-t border-[var(--gray-200)]">
              <span>Responsável: {selectedTask.assignee || '—'}</span>
              <span>Prazo: {selectedTask.dueDate || '—'}</span>
              <span>
                Concluída em:{' '}
                {selectedTask.completedAt ? new Date(selectedTask.completedAt).toLocaleDateString('pt-BR') : '—'}
              </span>
              <span>
                Arquivada em:{' '}
                {selectedTask.archivedAt ? new Date(selectedTask.archivedAt).toLocaleDateString('pt-BR') : '—'}
              </span>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Excluir tarefa permanentemente?"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              loading={deleting}
              onClick={() => selectedTask && handleDelete(selectedTask.id)}
            >
              Excluir definitivamente
            </Button>
          </div>
        }
      >
        <p className="text-size-body-small text-[var(--gray-700)]">
          Esta ação não pode ser desfeita. A tarefa "{selectedTask?.title}" será excluída permanentemente.
        </p>
      </Modal>
    </div>
  )
}
