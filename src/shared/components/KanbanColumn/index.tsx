import { Droppable } from '@hello-pangea/dnd'
import { Plus } from 'lucide-react'
import { TaskCard } from '../KanbanCard'
import type { Task } from '../../../types'

interface KanbanColumnProps {
  columnId: string
  title: string
  tasks: Task[]
  onAddTask?: () => void
  onTaskClick?: (taskId: string) => void
  onTaskEdit?: (taskId: string) => void
  onTaskDelete?: (taskId: string) => void
}

export function KanbanColumn({ columnId, title, tasks, onAddTask, onTaskClick, onTaskEdit, onTaskDelete }: KanbanColumnProps) {
  return (
    <div className="flex flex-col w-[280px] min-w-[240px] shrink-0 bg-[var(--kanban-track)] rounded-[var(--radius-lg)] min-h-[420px]">
      <div className="flex items-center gap-2.5 px-4 py-[13px] rounded-t-[var(--radius-lg)] bg-[var(--color-sidebar-bg)]">
        <h3 className="flex-1 text-[13.5px] font-semibold text-white truncate">{title}</h3>
        <span className="text-[11.5px] text-[#94a3b8] tabular-nums">{tasks.length}</span>
        {onAddTask && (
          <button
            onClick={onAddTask}
            className="w-6 h-6 rounded-md bg-white/10 text-white hover:bg-[var(--color-brand)] hover:text-[var(--color-brand-ink)] flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Adicionar tarefa"
          >
            <Plus size={13} />
          </button>
        )}
      </div>

      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex-1 p-3.5 space-y-3 transition-colors duration-[var(--duration-fast)]
              rounded-b-[var(--radius-lg)]
              ${snapshot.isDraggingOver ? 'bg-[var(--color-primary-100)]' : ''}
            `}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center h-20 text-size-caption text-[var(--muted-soft)]">
                Nenhuma tarefa
              </div>
            )}
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} onClick={() => onTaskClick?.(task.id)} onEdit={onTaskEdit ? () => onTaskEdit(task.id) : undefined} onDelete={onTaskDelete ? () => onTaskDelete(task.id) : undefined} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
