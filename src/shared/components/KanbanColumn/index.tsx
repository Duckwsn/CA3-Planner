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
    <div className="flex flex-col w-[320px] shrink-0">
      <div className="flex items-center justify-between h-12 px-4 rounded-t-[var(--radius-md)] bg-[var(--color-primary-900)]">
        <div className="flex items-center gap-2">
          <h3 className="text-size-body-small font-semibold text-white">{title}</h3>
          <span className="text-size-caption text-white/60">{tasks.length}</span>
        </div>
        {onAddTask && (
          <button onClick={onAddTask} className="text-white/60 hover:text-white cursor-pointer transition-colors" aria-label="Adicionar tarefa">
            <Plus size={16} />
          </button>
        )}
      </div>

      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex-1 min-h-[200px] p-2 space-y-2 rounded-b-[var(--radius-md)]
              transition-colors duration-[var(--duration-fast)]
              ${snapshot.isDraggingOver ? 'bg-[var(--color-primary-50)]' : 'bg-[var(--gray-100)]'}
            `}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center h-20 text-size-caption text-[var(--gray-400)]">
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
