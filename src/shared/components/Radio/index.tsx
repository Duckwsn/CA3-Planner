import { useId } from 'react'
import type { RadioProps, RadioGroupProps } from './Radio.types'

export function Radio({ label, className = '', id: externalId, ...props }: RadioProps) {
  const generatedId = useId()
  const radioId = externalId ?? generatedId

  return (
    <label htmlFor={radioId} className={`inline-flex items-center gap-3 cursor-pointer ${className}`}>
      <div className="relative flex items-center justify-center">
        <input
          type="radio"
          id={radioId}
          className="sr-only peer"
          {...props}
        />
        <div className="w-5 h-5 rounded-[var(--radius-full)] border-2 border-[var(--gray-300)] peer-checked:border-[var(--color-primary-900)] transition-colors duration-[var(--duration-fast)]" />
        <div className="absolute w-2.5 h-2.5 rounded-[var(--radius-full)] bg-[var(--color-primary-900)] scale-0 peer-checked:scale-100 transition-transform duration-[var(--duration-fast)]" />
      </div>
      {label && <span className="text-size-body-small text-[var(--gray-700)] select-none">{label}</span>}
    </label>
  )
}

export function RadioGroup({ name, value, onChange, options, className = '' }: RadioGroupProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {options.map((opt) => (
        <Radio
          key={opt.value}
          name={name}
          value={opt.value}
          label={opt.label}
          checked={value === opt.value}
          onChange={() => onChange(opt.value)}
        />
      ))}
    </div>
  )
}
