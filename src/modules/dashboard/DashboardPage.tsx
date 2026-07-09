import { useEffect, useMemo } from 'react'
import { LayoutDashboard, ListTodo, CheckCircle2, AlertTriangle } from 'lucide-react'
import { PageHeader } from '../../shared/components/PageHeader'
import { KpiCard } from '../../shared/components/KpiCard'
import { ErrorState } from '../../shared/components/ErrorState'
import { LoadingState } from '../../shared/components/LoadingState'
import { Card, CardHeader, CardBody } from '../../shared/components/Card'
import { Badge } from '../../shared/components/Badge'
import { ProgressBar } from '../../shared/components/ProgressBar'
import { useBoardStore } from '../../stores/domain/boardStore'
import { useTaskStore } from '../../stores/domain/taskStore'
import { COLUMNS, getPriorityLabel, getPriorityVariant } from '../../types/task.types'
import { formatDate } from '../../utils/formatDate'

export default function DashboardPage() {
  const boards = useBoardStore((s) => s.boards)
  const loadBoards = useBoardStore((s) => s.loadBoards)
  const tasks = useTaskStore((s) => s.tasks)
  const tasksLoading = useTaskStore((s) => s.loading)
  const loadAllTasks = useTaskStore((s) => s.loadAllTasks)
  const error = useBoardStore((s) => s.error)

  useEffect(() => {
    loadBoards()
    loadAllTasks()
  }, [loadBoards, loadAllTasks])

  const metrics = useMemo(() => {
    const total = tasks.length
    const done = tasks.filter((t) => t.status === 'done').length
    const overdue = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length
    return { totalBoards: boards.length, totalTasks: total, completedTasks: done, overdueTasks: overdue }
  }, [boards, tasks])

  if (error) return <ErrorState title="Erro" description={error} onRetry={() => { loadBoards(); loadAllTasks() }} />

  if (tasksLoading && tasks.length === 0) return <LoadingState message="Carregando dashboard..." />

  const tasksByStatus = COLUMNS.map((col) => ({
    ...col,
    count: tasks.filter((t) => t.status === col.key).length,
  }))

  const tasksByBoard = boards.map((b) => ({
    id: b.id,
    title: b.title,
    total: tasks.filter((t) => t.boardId === b.id).length,
    done: tasks.filter((t) => t.boardId === b.id && t.status === 'done').length,
  }))

  const recentTasks = tasks
    .filter((t) => t.status !== 'done')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(0, 5)

  const upcomingTasks = tasks
    .filter((t) => t.dueDate && t.status !== 'done')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)

  return (
    <div>
      <PageHeader title="Dashboard" description="Visão executiva do ambiente pedagógico" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <KpiCard icon={<LayoutDashboard size={20} />} title="Quadros Ativos" value={metrics.totalBoards} />
        <KpiCard icon={<ListTodo size={20} />} title="Tarefas Totais" value={metrics.totalTasks} />
        <KpiCard icon={<CheckCircle2 size={20} />} title="Concluídas" value={metrics.completedTasks} variation={metrics.totalTasks ? `${Math.round((metrics.completedTasks / metrics.totalTasks) * 100)}%` : '0%'} variationType="positive" />
        <KpiCard icon={<AlertTriangle size={20} />} title="Em Atraso" value={metrics.overdueTasks} variation={metrics.overdueTasks > 0 ? `${metrics.overdueTasks} pendentes` : '0'} variationType={metrics.overdueTasks > 0 ? 'negative' : 'positive'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution by Status */}
        <Card border>
          <CardHeader>
            <h3 className="text-size-h6 font-semibold text-[var(--color-text-primary)]">Distribuição por Status</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {tasksByStatus.map((col) => (
                <div key={col.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-size-body-small text-[var(--color-text-secondary)]">{col.label}</span>
                    <span className="text-size-body-small font-medium text-[var(--color-text-primary)]">{col.count}</span>
                  </div>
                  <ProgressBar value={col.count} max={metrics.totalTasks} color="var(--color-primary-600)" />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Tasks per Board */}
        <Card border>
          <CardHeader>
            <h3 className="text-size-h6 font-semibold text-[var(--color-text-primary)]">Tarefas por Board</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {tasksByBoard.map((b) => (
                <div key={b.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-size-body-small text-[var(--color-text-secondary)] truncate">{b.title}</span>
                    <span className="text-size-body-small font-medium text-[var(--color-text-primary)]">{b.done}/{b.total}</span>
                  </div>
                  <ProgressBar value={b.done} max={b.total} color="var(--color-success-500)" />
                </div>
              ))}
              {tasksByBoard.length === 0 && (
                <p className="text-size-body-small text-[var(--text-muted,var(--gray-400))] text-center py-4">Nenhum board encontrado</p>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Recent Tasks */}
        <Card border>
          <CardHeader>
            <h3 className="text-size-h6 font-semibold text-[var(--color-text-primary)]">Tarefas Recentes</h3>
          </CardHeader>
          <CardBody>
            {recentTasks.length === 0 ? (
              <p className="text-size-body-small text-[var(--text-muted,var(--gray-400))] text-center py-4">Nenhuma tarefa pendente</p>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between py-2 border-b border-[var(--color-border-light)] last:border-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-size-body-small font-medium text-[var(--color-text-primary)] truncate">{task.title}</p>
                      <p className="text-size-caption text-[var(--color-text-secondary)]">{task.assignee || 'Sem responsável'}</p>
                    </div>
                    <Badge variant={getPriorityVariant(task.priority)}>{getPriorityLabel(task.priority)}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Upcoming Deliveries */}
        <Card border>
          <CardHeader>
            <h3 className="text-size-h6 font-semibold text-[var(--color-text-primary)]">Próximas Entregas</h3>
          </CardHeader>
          <CardBody>
            {upcomingTasks.length === 0 ? (
              <p className="text-size-body-small text-[var(--text-muted,var(--gray-400))] text-center py-4">Nenhuma entrega próxima</p>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => {
                  const isOverdue = new Date(task.dueDate) < new Date()
                  return (
                    <div key={task.id} className="flex items-center justify-between py-2 border-b border-[var(--color-border-light)] last:border-0">
                      <div className="min-w-0 flex-1">
                        <p className="text-size-body-small font-medium text-[var(--color-text-primary)] truncate">{task.title}</p>
                        <p className={`text-size-caption ${isOverdue ? 'text-[var(--color-danger-600)]' : 'text-[var(--color-text-secondary)]'}`}>
                          {formatDate(task.dueDate)}
                        </p>
                      </div>
                      <Badge variant={getPriorityVariant(task.priority)}>{getPriorityLabel(task.priority)}</Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
