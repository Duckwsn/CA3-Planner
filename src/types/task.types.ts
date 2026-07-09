export type TaskStatus = 'todo' | 'doing' | 'review' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Task {
  id: string
  boardId: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignee: string
  dueDate: string
  createdAt: string
  updatedAt: string
}

export interface TaskFormData {
  title: string
  description: string
  priority: TaskPriority
  assignee: string
  dueDate: string
}

export const COLUMNS = [
  { key: 'todo' as const, label: 'A Fazer' },
  { key: 'doing' as const, label: 'Fazendo' },
  { key: 'review' as const, label: 'Revisão' },
  { key: 'done' as const, label: 'Concluído' },
]

const priorityConfig = {
  low: { label: 'Baixa', variant: 'default' as const },
  medium: { label: 'Média', variant: 'info' as const },
  high: { label: 'Alta', variant: 'warning' as const },
  urgent: { label: 'Urgente', variant: 'danger' as const },
}

export function getPriorityLabel(priority: TaskPriority): string {
  return priorityConfig[priority].label
}

export function getPriorityVariant(priority: TaskPriority): 'default' | 'info' | 'warning' | 'danger' {
  return priorityConfig[priority].variant
}
