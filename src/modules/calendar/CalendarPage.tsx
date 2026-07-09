import { useState, useMemo, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PageHeader } from '../../shared/components/PageHeader'
import { Card } from '../../shared/components/Card'
import { LoadingState } from '../../shared/components/LoadingState'
import { Badge } from '../../shared/components/Badge'
import { useTaskStore } from '../../stores/domain/taskStore'
import { getPriorityLabel, getPriorityVariant } from '../../types/task.types'
import { formatDate } from '../../utils/formatDate'

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const tasks = useTaskStore((s) => s.tasks)
  const tasksLoading = useTaskStore((s) => s.loading)
  const loadAllTasks = useTaskStore((s) => s.loadAllTasks)

  useEffect(() => { loadAllTasks() }, [loadAllTasks])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPad = firstDay.getDay()
    const days: (number | null)[] = Array(startPad).fill(null)
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(d)
    return days
  }, [year, month])

  if (tasksLoading && tasks.length === 0) return <LoadingState message="Carregando calendário..." />

  function getTasksForDate(day: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return tasks.filter((t) => t.dueDate === dateStr)
  }

  const selectedTasks = selectedDate ? getTasksForDate(selectedDate.getDate()) : []

  return (
    <div>
      <PageHeader title="Calendário" description="Visualização mensal das atividades" />

      <Card border>
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-2 rounded-[var(--radius-md)] hover:bg-[var(--gray-100)] cursor-pointer transition-colors">
            <ChevronLeft size={20} className="text-[var(--color-text-secondary)]" />
          </button>
          <h2 className="text-size-h5 font-semibold text-[var(--color-text-primary)]">
            {monthNames[month]} {year}
          </h2>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-2 rounded-[var(--radius-md)] hover:bg-[var(--gray-100)] cursor-pointer transition-colors">
            <ChevronRight size={20} className="text-[var(--color-text-secondary)]" />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((d) => (
            <div key={d} className="text-center text-size-caption font-semibold text-[var(--color-text-secondary)] py-2 uppercase tracking-wider">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 border-t border-l border-[var(--gray-200)]">
          {calendarDays.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} className="min-h-[110px] p-2 border-r border-b border-[var(--gray-200)] bg-[var(--gray-50)]" />
            const today = new Date()
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
            const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === month
            const dayTasks = getTasksForDate(day)

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(new Date(year, month, day))}
                className={`
                  min-h-[110px] p-2 border-r border-b border-[var(--gray-200)] text-left
                  hover:bg-[var(--color-primary-50)] transition-colors cursor-pointer
                  ${isToday ? 'bg-[var(--color-gold-50)]' : ''}
                  ${isSelected ? 'ring-2 ring-[var(--color-primary-600)] ring-inset' : ''}
                `}
              >
                <span className={`
                  inline-flex items-center justify-center w-7 h-7 rounded-[var(--radius-full)] text-size-caption mb-1 font-medium
                  ${isToday ? 'bg-[var(--color-gold-500)] text-white font-bold' : 'text-[var(--color-text-primary)]'}
                `}>
                  {day}
                </span>
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((t) => (
                    <div key={t.id} className="flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${t.status === 'done' ? 'bg-[var(--color-success-500)]' : 'bg-[var(--color-primary-500)]'}`} />
                      <span className="text-[10px] text-[var(--color-text-primary)] truncate leading-tight">{t.title}</span>
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <span className="text-[10px] text-[var(--color-text-secondary)] font-medium">+{dayTasks.length - 3} mais</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Selected day tasks */}
      {selectedDate && (
        <Card border className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-size-h6 font-semibold text-[var(--color-text-primary)]">
              Tarefas - {formatDate(selectedDate)}
            </h3>
          </div>
          {selectedTasks.length === 0 ? (
            <p className="text-size-body-small text-[var(--gray-400)]">Nenhuma tarefa para esta data</p>
          ) : (
            <div className="space-y-2">
              {selectedTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between py-2 px-3 rounded-[var(--radius-md)] bg-[var(--gray-50)]">
                  <div>
                    <p className="text-size-body-small font-medium text-[var(--color-text-primary)]">{task.title}</p>
                    <p className="text-size-caption text-[var(--color-text-secondary)]">{task.assignee || 'Sem responsável'}</p>
                  </div>
                  <Badge variant={getPriorityVariant(task.priority)}>{getPriorityLabel(task.priority)}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
