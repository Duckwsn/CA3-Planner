import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Archive } from 'lucide-react'
import { Button } from '../../shared/components/Button'
import { LoadingState } from '../../shared/components/LoadingState'
import { ErrorState } from '../../shared/components/ErrorState'
import { Badge } from '../../shared/components/Badge'
import { getPriorityLabel, getPriorityVariant } from '../../types/task.types'
import { apiGet } from '../../core/api/httpClient'
import type { Task } from '../../types'

interface ArchivedTask extends Task {
  board: { title: string; color: string }
}

export default function ArchivedTasksPage() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<ArchivedTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiGet<ArchivedTask[]>('/tasks/archived')
      .then(setTasks)
      .catch(() => setError('Erro ao carregar tarefas arquivadas'))
      .finally(() => setLoading(false))
  }, [])

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
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" iconLeft={<ArrowLeft size={16} />} onClick={() => navigate(-1)}>
          Voltar
        </Button>
        <div className="flex items-center gap-2">
          <Archive size={20} className="text-[var(--gray-500)]" />
          <h1 className="text-size-h4 font-semibold text-[var(--gray-900)]">Tarefas Arquivadas</h1>
        </div>
      </div>

      {tasks.length === 0 ? (
        <p className="text-size-body-small text-[var(--gray-500)]">Nenhuma tarefa arquivada.</p>
      ) : (
        categories.map((cat) => {
          const catTasks = grouped[cat]!
          return (
          <div key={cat} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant={getPriorityVariant(cat as any)}>{getPriorityLabel(cat as any)}</Badge>
              <span className="text-size-caption text-[var(--gray-400)]">{catTasks.length} tarefa(s)</span>
            </div>
            <div className="space-y-2">
              {catTasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-[var(--gray-50)] border border-[var(--gray-200)]">
                  <div className="flex-1 min-w-0">
                    <p className="text-size-body-small font-medium text-[var(--gray-900)] truncate">{t.title}</p>
                    <p className="text-size-caption text-[var(--gray-500)]">
                      {t.board.title} {t.assignee ? `• ${t.assignee}` : ''}
                    </p>
                  </div>
                  <div className="text-size-caption text-[var(--gray-400)] shrink-0 ml-4">
                    {t.archivedAt ? new Date(t.archivedAt).toLocaleDateString('pt-BR') : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
          )
        })
      )}
    </div>
  )
}
