import type { ReactNode } from 'react'

export interface KpiCardProps {
  icon: ReactNode
  title: string
  value: string | number
  variation?: string
  variationType?: 'positive' | 'negative'
}
