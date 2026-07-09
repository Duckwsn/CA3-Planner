import type { CardProps, CardHeaderProps, CardBodyProps, CardFooterProps } from './Card.types'

const paddingClasses: Record<string, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export function Card({ padding = 'lg', hover = false, border = false, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`
        bg-[var(--color-bg-card)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]
        ${border ? 'border border-[var(--color-card-border)]' : ''}
        ${paddingClasses[padding]}
        ${hover ? 'hover:shadow-[var(--shadow-md)] transition-shadow duration-[var(--duration-fast)]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className = '', children, ...props }: CardHeaderProps) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardBody({ className = '', children, ...props }: CardBodyProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className = '', children, ...props }: CardFooterProps) {
  return (
    <div className={`mt-4 pt-4 border-t border-[var(--gray-200)] ${className}`} {...props}>
      {children}
    </div>
  )
}
