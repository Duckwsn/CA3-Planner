import { useId } from 'react'
import { Check } from 'lucide-react'
import type { CheckboxProps } from './Checkbox.types'

export function Checkbox({ label, className = '', id: externalId, ...props }: CheckboxProps) {
  const generatedId = useId()
  const checkboxId = externalId ?? generatedId

  return (
    <label htmlFor={checkboxId} className={`inline-flex items-center gap-3 cursor-pointer ${className}`}>
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          id={checkboxId}
          className="sr-only peer"
          {...props}
        />
        <div className="w-5 h-5 rounded-[var(--radius-sm)] border-2 border-[var(--gray-300)] peer-checked:border-[var(--color-primary-900)] peer-checked:bg-[var(--color-primary-900)] transition-colors duration-[var(--duration-fast)]" />
        <Check size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-[var(--duration-fast)] pointer-events-none" />
      </div>
      {label && <span className="text-size-body-small text-[var(--gray-700)] select-none">{label}</span>}
    </label>
  )
}
