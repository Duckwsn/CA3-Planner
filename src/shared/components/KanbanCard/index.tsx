import { Draggable } from '@hello-pangea/dnd'
import { GripVertical, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '../Badge'
import type { Task } from '../../../types'
import { getPriorityLabel, getPriorityVariant } from '../../../types/task.types'
import { formatDate } from '../../../utils/formatDate'

interface TaskCardProps {
  task: Task
  index: number
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export function TaskCard({ task, index, onClick, onEdit, onDelete }: TaskCardProps) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, _snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          onClick={onClick}
          className="task-card group relative bg-[var(--color-bg-card)] rounded-[var(--radius-md)] shadow-[var(--shadow-xs)] transition-shadow duration-[var(--duration-fast)] cursor-pointer focus-within:shadow-[var(--shadow-md)]"
          style={{ ...provided.draggableProps.style }}
        >
          <div className={`p-4 ${isOverdue ? 'border-l-2 border-[var(--color-danger-500)]' : ''}`}>
            <div className="flex items-start gap-2">
              <div {...provided.dragHandleProps} className="mt-0.5 text-[var(--gray-300)] hover:text-[var(--gray-500)] cursor-grab shrink-0">
                <GripVertical size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-size-body-small font-medium text-[var(--gray-900)] truncate">{task.title}</h4>
                {task.description && (
                  <p className="text-size-caption text-[var(--gray-500)] line-clamp-2 mt-1">{task.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge variant={getPriorityVariant(task.priority)}>{getPriorityLabel(task.priority)}</Badge>
                  {task.assignee && (
                    <span className="text-size-caption text-[var(--gray-400)]">{task.assignee}</span>
                  )}
                  {task.dueDate && (
                    <span className={`text-size-caption ${isOverdue ? 'text-[var(--color-danger-600)] font-medium' : 'text-[var(--gray-400)]'}`}>
                      {formatDate(task.dueDate)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons — hover/ focus-within reveal */}
          <div
            className="task-actions absolute top-2 right-2 flex items-center gap-1 opacity-0 pointer-events-none transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 group-hover:pointer-events-auto group-focus-within:pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {onEdit && (
              <button
                onClick={onEdit}
                className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-bg-surface)] border border-[var(--color-border-light)] text-[var(--gray-500)] hover:text-[var(--color-primary-600)] hover:border-[var(--color-primary-300)] shadow-[var(--shadow-xs)] cursor-pointer transition-colors"
                aria-label="Editar tarefa"
              >
                <Pencil size={14} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-bg-surface)] border border-[var(--color-border-light)] text-[var(--gray-500)] hover:text-[var(--color-danger-600)] hover:border-[var(--color-danger-300)] shadow-[var(--shadow-xs)] cursor-pointer transition-colors"
                aria-label="Excluir tarefa"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}
