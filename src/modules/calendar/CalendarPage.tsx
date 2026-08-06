import { useState, useMemo, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
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
    while (days.length % 7 !== 0) days.push(null)
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
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 items-start">
        <Card border padding="none" className="overflow-hidden">
          <div className="flex items-center justify-between px-[18px] py-[14px] border-b border-[var(--color-card-border)]">
            <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="w-[30px] h-[30px] rounded-[8px] border border-[var(--color-card-border)] bg-[var(--color-bg-card)] text-[var(--muted)] flex items-center justify-center hover:bg-[var(--color-bg-subtle)] cursor-pointer transition-colors" aria-label="Mês anterior">
              <ChevronLeft size={16} />
            </button>
            <h2 className="text-[16px] font-bold text-[var(--color-text-primary)]">
              {monthNames[month]} {year}
            </h2>
            <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="w-[30px] h-[30px] rounded-[8px] border border-[var(--color-card-border)] bg-[var(--color-bg-card)] text-[var(--muted)] flex items-center justify-center hover:bg-[var(--color-bg-subtle)] cursor-pointer transition-colors" aria-label="Próximo mês">
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 border-b border-[var(--color-card-border)]">
            {weekDays.map((d) => (
              <div key={d} className="py-2 text-center text-[11px] font-bold uppercase tracking-[0.6px] text-[var(--muted-soft)]">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} className="min-h-[84px] max-sm:min-h-[64px] p-1.5 border-r border-b border-[var(--color-card-border)] bg-[var(--color-bg-subtle)] [&:nth-child(7n)]:border-r-0" />
              const today = new Date()
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
              const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === month
              const dayTasks = getTasksForDate(day)

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(new Date(year, month, day))}
                  className={`
                    min-h-[84px] max-sm:min-h-[64px] p-1.5 border-r border-b border-[var(--color-card-border)] text-left
                    [&:nth-child(7n)]:border-r-0 hover:bg-[var(--color-bg-subtle)] transition-colors cursor-pointer
                    ${isSelected ? 'outline-2 outline-[var(--color-info)] outline-offset-[-2px]' : ''}
                  `}
                >
                  <span className={`
                    inline-flex items-center justify-center w-[22px] h-[22px] rounded-full text-[12px] mb-[3px] tabular-nums
                    ${isToday ? 'bg-[var(--color-gold-500)] text-[var(--color-brand-ink)] font-bold' : 'text-[var(--muted-soft)] font-semibold'}
                  `}>
                    {day}
                  </span>
                  <div className="space-y-[2px]">
                    {dayTasks.slice(0, 3).map((t) => (
                      <div key={t.id} className="flex items-center gap-[5px]">
                        <div className={`w-[6px] h-[6px] rounded-full shrink-0 ${t.status === 'done' ? 'bg-[var(--color-success-500)]' : 'bg-[var(--color-primary-500)]'}`} />
                        <span className="text-[11px] text-[var(--color-text-primary)] truncate leading-tight">{t.title}</span>
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <span className="text-[10.5px] text-[var(--muted-soft)]">+{dayTasks.length - 3} mais</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </Card>

        {/* Selected day tasks */}
        <Card border className="lg:sticky lg:top-6">
          <h3 className="text-[15px] font-bold text-[var(--color-text-primary)] mb-[14px]">
            Tarefas - {selectedDate ? formatDate(selectedDate) : 'Hoje'}
          </h3>
          {selectedTasks.length === 0 ? (
            <p className="text-[13.5px] text-[var(--muted-soft)]">Nenhuma tarefa para esta data</p>
          ) : (
            <div>
              {selectedTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between gap-3 py-[14px] border-b border-[var(--color-card-border)] last:border-b-0">
                  <div className="flex flex-col gap-[3px] min-w-0">
                    <span className="text-[14px] font-semibold text-[var(--color-text-primary)] truncate">{task.title}</span>
                    <span className="text-[12px] text-[var(--muted-soft)]">{task.assignee || 'Sem responsável'}</span>
                  </div>
                  <Badge variant={getPriorityVariant(task.priority)}>{getPriorityLabel(task.priority)}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
