import { useId } from 'react'
import type { SwitchProps } from './Switch.types'

export function Switch({ label, className = '', id: externalId, ...props }: SwitchProps) {
  const generatedId = useId()
  const switchId = externalId ?? generatedId

  return (
    <label htmlFor={switchId} className={`inline-flex items-center gap-3 cursor-pointer ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          id={switchId}
          className="sr-only peer"
          {...props}
        />
        <div className="w-11 h-6 rounded-[var(--radius-full)] bg-[var(--gray-300)] peer-checked:bg-[var(--color-primary-900)] transition-colors duration-[var(--duration-fast)]" />
        <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-[var(--radius-full)] bg-white shadow-[var(--shadow-sm)] peer-checked:translate-x-5 transition-transform duration-[var(--duration-fast)]" />
      </div>
      {label && <span className="text-size-body-small text-[var(--gray-700)] select-none">{label}</span>}
    </label>
  )
}
