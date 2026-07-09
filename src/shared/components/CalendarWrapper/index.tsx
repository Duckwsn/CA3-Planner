import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CalendarWrapperProps {
  currentDate: Date
  onDateChange: (date: Date) => void
  events?: { date: string; count: number; color?: string }[]
  className?: string
}

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

export function CalendarWrapper({ currentDate, onDateChange, events = [], className = '' }: CalendarWrapperProps) {
  const { days, startPad } = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPad = firstDay.getDay()
    const days: number[] = []
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(d)
    return { days, startPad }
  }, [currentDate])

  const eventMap = useMemo(() => {
    const map = new Map<string, number>()
    events.forEach((e) => map.set(e.date, (map.get(e.date) ?? 0) + e.count))
    return map
  }, [events])

  function prevMonth() {
    onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  function nextMonth() {
    onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  return (
    <div className={`bg-[var(--color-bg-card)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--color-border-light)] p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 rounded-[var(--radius-md)] hover:bg-[var(--gray-100)] transition-colors cursor-pointer">
          <ChevronLeft size={18} className="text-[var(--gray-600)]" />
        </button>
        <h3 className="text-size-h6 font-semibold text-[var(--gray-900)]">
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button onClick={nextMonth} className="p-2 rounded-[var(--radius-md)] hover:bg-[var(--gray-100)] transition-colors cursor-pointer">
          <ChevronRight size={18} className="text-[var(--gray-600)]" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((day) => (
          <div key={day} className="text-center text-size-caption font-medium text-[var(--gray-500)] py-2">
            {day}
          </div>
        ))}

        {Array.from({ length: startPad }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {days.map((d) => {
          const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
          const isToday = dateStr === todayStr
          const eventCount = eventMap.get(dateStr) ?? 0

          return (
            <button
              key={d}
              onClick={() => onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth(), d))}
              className={`
                relative flex flex-col items-center justify-center h-10 rounded-[var(--radius-md)]
                text-size-body-small transition-colors cursor-pointer
                ${isToday ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-900)] font-semibold' : 'hover:bg-[var(--gray-100)] text-[var(--gray-700)]'}
              `}
            >
              <span>{d}</span>
              {eventCount > 0 && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-[var(--radius-full)] bg-[var(--color-primary-900)]" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
