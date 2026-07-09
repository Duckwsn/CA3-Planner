import type { Task } from './task.types'

export interface Board {
  id: string
  title: string
  description: string
  color: string
  userId: string
  organizationId: string
  createdAt: string
  updatedAt: string
  _count?: { tasks: number }
  tasks?: Task[]
}

export interface BoardFormData {
  title: string
  description: string
  color: string
}

export const BOARD_COLORS = [
  { value: '#2563eb', label: 'Azul' },
  { value: '#059669', label: 'Verde' },
  { value: '#7c3aed', label: 'Roxo' },
  { value: '#ea580c', label: 'Laranja' },
  { value: '#dc2626', label: 'Vermelho' },
  { value: '#0d9488', label: 'Teal' },
  { value: '#db2777', label: 'Rosa' },
  { value: '#4f46e5', label: 'Índigo' },
] as const
