import { Draggable } from '@hello-pangea/dnd'
import { User, Pencil, Trash2 } from 'lucide-react'
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
          {...provided.dragHandleProps}
          onClick={onClick}
          className="group relative bg-[var(--card-elevated)] border border-[var(--card-elevated-border)] rounded-[10px] px-[15px] py-[14px] shadow-[0_1px_2px_rgba(15,31,61,.06),0_2px_8px_rgba(15,31,61,.05)] transition-shadow duration-[var(--duration-fast)] cursor-pointer hover:shadow-[var(--shadow-md)]"
          style={{ ...provided.draggableProps.style, borderLeft: isOverdue ? '3px solid var(--color-danger)' : undefined }}
        >
          <h4 className="text-[13.5px] font-semibold text-[var(--color-text-primary)] leading-[1.4] mb-2 truncate">
            {task.title}
          </h4>
          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
            <Badge variant={getPriorityVariant(task.priority)}>{getPriorityLabel(task.priority)}</Badge>
          </div>
          <div className="flex items-center justify-between gap-2 flex-wrap text-[12px] text-[var(--muted-soft)]">
            {task.assignee ? (
              <span className="inline-flex items-center gap-1">
                <User size={11} />
                {task.assignee}
              </span>
            ) : (
              <span />
            )}
            {task.dueDate && (
              <span className={isOverdue ? 'text-[var(--color-danger)] font-semibold' : ''}>
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>

          {(onEdit || onDelete) && (
            <div
              className="absolute top-2 right-2 flex items-center gap-1 opacity-0 pointer-events-none transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 group-hover:pointer-events-auto group-focus-within:pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="w-7 h-7 flex items-center justify-center rounded-[8px] bg-[var(--color-bg-surface)] border border-[var(--color-border-light)] text-[var(--muted)] hover:text-[var(--color-info)] shadow-[var(--shadow-xs)] cursor-pointer transition-colors"
                  aria-label="Editar tarefa"
                >
                  <Pencil size={12} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="w-7 h-7 flex items-center justify-center rounded-[8px] bg-[var(--color-bg-surface)] border border-[var(--color-border-light)] text-[var(--muted)] hover:text-[var(--color-danger)] hover:border-[var(--color-danger-bg)] hover:bg-[var(--color-danger-bg)] shadow-[var(--shadow-xs)] cursor-pointer transition-colors"
                  aria-label="Excluir tarefa"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}
