import { useMemo } from 'react'
import type { AvatarProps } from './Avatar.types'

const sizeClasses: Record<string, string> = {
  sm: 'w-8 h-8 text-size-caption',
  md: 'w-10 h-10 text-size-body-small',
  lg: 'w-12 h-12 text-size-body',
}

const bgColors = [
  'bg-[var(--color-primary-600)]',
  'bg-[var(--color-info-600)]',
  'bg-[var(--color-success-600)]',
  'bg-[var(--color-warning-600)]',
  'bg-[var(--color-danger-600)]',
  'bg-[var(--color-gold-500)]',
]

export function Avatar({ src, name = '', size = 'md', className = '', ...props }: AvatarProps) {
  const initials = useMemo(() => {
    return name
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }, [name])

  const bgColor = useMemo(() => {
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return bgColors[Math.abs(hash) % bgColors.length]
  }, [name])

  return (
    <div
      className={`
        relative inline-flex items-center justify-center rounded-[var(--radius-full)]
        overflow-hidden shrink-0
        ${sizeClasses[size]}
        ${!src ? bgColor : ''}
        ${className}
      `}
      aria-label={name || 'Avatar'}
      {...props}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : initials ? (
        <span className="text-white font-semibold leading-none">{initials}</span>
      ) : (
        <svg className="w-1/2 h-1/2 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      )}
    </div>
  )
}
