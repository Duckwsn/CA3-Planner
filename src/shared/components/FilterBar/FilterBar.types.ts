import type { ReactNode } from 'react'

export interface FilterChip {
  id: string
  label: string
  active: boolean
}

export interface FilterBarProps {
  chips: FilterChip[]
  onToggle: (id: string) => void
  onClear: () => void
  children?: ReactNode
  className?: string
}
