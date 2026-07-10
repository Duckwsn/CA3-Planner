import { useState, useRef } from 'react'
import type { TooltipProps } from './Tooltip.types'

const positionClasses: Record<string, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
}

export function Tooltip({ content, children, position = 'top', className = '' }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  function show() {
    clearTimeout(timeoutRef.current)
    setVisible(true)
  }

  function hide() {
    timeoutRef.current = setTimeout(() => setVisible(false), 100)
  }

  return (
    <div className={`relative inline-flex ${className}`} onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      {visible && (
        <div
          className={`
            absolute z-[var(--z-tooltip)] px-2.5 py-1.5 rounded-[var(--radius-md)]
            bg-[var(--gray-800)] text-white text-size-caption whitespace-nowrap
            pointer-events-none animate-fade-in
            ${positionClasses[position]}
          `}
        >
          {content}
        </div>
      )}
    </div>
  )
}
