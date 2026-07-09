import { useState, useEffect, useMemo, useCallback } from 'react'
import { CheckCircle2, ListTodo, Users, BarChart3, FileText } from 'lucide-react'
import { PageHeader } from '../../shared/components/PageHeader'
import { KpiCard } from '../../shared/components/KpiCard'
import { LoadingState } from '../../shared/components/LoadingState'
import { ProgressBar, StackedProgressBar } from '../../shared/components/ProgressBar'
import { Card, CardHeader, CardBody } from '../../shared/components/Card'
import { useBoardStore } from '../../stores/domain/boardStore'
import { useTaskStore } from '../../stores/domain/taskStore'
import { useTeamStore } from '../../stores/domain/teamStore'
import { useAuthStore } from '../../stores/core/authStore'
import { getPriorityLabel, COLUMNS } from '../../types/task.types'
import { exportReport } from '../../services/ReportExporter'

export default function ReportsPage() {
  const [exporting, setExporting] = useState(false)

  const boards = useBoardStore((s) => s.boards)
  const loadBoards = useBoardStore((s) => s.loadBoards)
  const tasks = useTaskStore((s) => s.tasks)
  const tasksLoading = useTaskStore((s) => s.loading)
  const loadAllTasks = useTaskStore((s) => s.loadAllTasks)
  const teams = useTeamStore((s) => s.teams)
  const loadTeams = useTeamStore((s) => s.loadTeams)
  const user = useAuthStore((s) => s.user)

  useEffect(() => { loadBoards(); loadAllTasks(); loadTeams() }, [loadBoards, loadAllTasks, loadTeams])

  const handleExport = useCallback(async () => {
    if (exporting) return
    setExporting(true)
    try {
      await exportReport({ boards, tasks, teams, user })
    } catch (err) {
      console.error('[EXPORT_PDF]', err)
      alert('Erro ao gerar o relatório. Tente novamente.')
    } finally {
      setExporting(false)
    }
  }, [boards, tasks, teams, user, exporting])

  const metrics = useMemo(() => {
    const total = tasks.length
    const done = tasks.filter((t) => t.status === 'done').length
    const overdue = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length
    return { total, done, overdue, completionRate: total ? Math.round((done / total) * 100) : 0 }
  }, [tasks])

  const priorityDist = useMemo(() => {
    const dist: Record<string, number> = { low: 0, medium: 0, high: 0, urgent: 0 }
    tasks.forEach((t) => { dist[t.priority] = (dist[t.priority] ?? 0) + 1 })
    return dist
  }, [tasks])

  const statusDist = useMemo(() => {
    return COLUMNS.map((col) => ({ label: col.label, count: tasks.filter((t) => t.status === col.key).length }))
  }, [tasks])

  const assigneeDist = useMemo(() => {
    const dist: Record<string, { total: number; done: number }> = {}
    tasks.forEach((t) => {
      const key = t.assignee || 'Sem responsável'
      if (!dist[key]) dist[key] = { total: 0, done: 0 }
      dist[key].total++
      if (t.status === 'done') dist[key].done++
    })
    return Object.entries(dist).sort((a, b) => b[1].total - a[1].total)
  }, [tasks])

  if (tasksLoading && tasks.length === 0) return <LoadingState message="Carregando relatórios..." />

  return (
    <div>
      <PageHeader
        title="Relatórios"
        description="Indicadores e métricas do ambiente pedagógico"
        actions={
          <button
            onClick={handleExport}
            disabled={exporting || tasksLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-size-body-small font-semibold text-white bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <FileText size={16} />
            {exporting ? 'Gerando...' : 'Exportar PDF'}
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <KpiCard icon={<BarChart3 size={20} />} title="Total de Quadros" value={boards.length} />
        <KpiCard icon={<ListTodo size={20} />} title="Total de Tarefas" value={metrics.total} />
        <KpiCard icon={<CheckCircle2 size={20} />} title="Concluídas" value={`${metrics.completionRate}%`} variation={`${metrics.done}/${metrics.total}`} variationType="positive" />
        <KpiCard icon={<Users size={20} />} title="Membros" value={teams.reduce((acc, t) => acc + (t.members?.length ?? 0), 0)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Priority Distribution */}
        <Card border>
          <CardHeader><h3 className="text-size-h6 font-semibold text-[var(--color-text-primary)]">Distribuição por Prioridade</h3></CardHeader>
          <CardBody>
            <div className="space-y-3">
              {Object.entries(priorityDist).map(([key, count]) => {
                const max = Math.max(...Object.values(priorityDist), 1)
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-size-body-small text-[var(--color-text-secondary)]">{getPriorityLabel(key as any)}</span>
                      <span className="text-size-body-small font-medium text-[var(--color-text-primary)]">{count}</span>
                    </div>
                    <ProgressBar value={count} max={max} color="var(--color-primary-500)" />
                  </div>
                )
              })}
            </div>
          </CardBody>
        </Card>

        {/* Status Distribution */}
        <Card border>
          <CardHeader><h3 className="text-size-h6 font-semibold text-[var(--color-text-primary)]">Distribuição por Status</h3></CardHeader>
          <CardBody>
            <div className="space-y-3">
              {statusDist.map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-size-body-small text-[var(--color-text-secondary)]">{s.label}</span>
                    <span className="text-size-body-small font-medium text-[var(--color-text-primary)]">{s.count}</span>
                  </div>
                  <ProgressBar value={s.count} max={Math.max(...statusDist.map((x) => x.count), 1)} color="var(--color-info-500)" />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Tasks per Assignee */}
      <Card border>
        <CardHeader><h3 className="text-size-h6 font-semibold text-[var(--color-text-primary)]">Tarefas por Responsável</h3></CardHeader>
        <CardBody>
          {assigneeDist.length === 0 ? (
            <p className="text-size-body-small text-[var(--text-muted,var(--gray-400))] text-center py-4">Nenhuma tarefa encontrada</p>
          ) : (
            <div className="space-y-4">
              {assigneeDist.map(([name, data]) => (
                <div key={name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-size-body-small text-[var(--color-text-secondary)]">{name}</span>
                    <span className="text-size-body-small font-medium text-[var(--color-text-primary)]">{data.done}/{data.total} concluídas</span>
                  </div>
                  <StackedProgressBar
                    height="h-3"
                    segments={[
                      { value: data.done, color: 'var(--color-success-500)' },
                      { value: data.total - data.done, color: 'var(--gray-300)' },
                    ]}
                  />
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
