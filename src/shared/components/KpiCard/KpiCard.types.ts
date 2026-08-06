import type { ReactNode } from 'react'

export type KpiTone = 'blue' | 'indigo' | 'green' | 'red' | 'amber'

export interface KpiCardProps {
  icon: ReactNode
  title: string
  value: string | number
  variation?: string
  variationType?: 'positive' | 'negative'
  tone?: KpiTone
}
