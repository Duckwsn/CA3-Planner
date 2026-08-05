import type { HTMLAttributes, ReactNode } from 'react'

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'urgent' | 'high' | 'medium'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  children?: ReactNode
}
