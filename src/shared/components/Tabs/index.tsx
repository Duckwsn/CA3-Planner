import type { TabsProps } from './Tabs.types'

export function Tabs({ tabs, activeTab, onChange, className = '' }: TabsProps) {
  return (
    <div className={`flex border-b border-[var(--gray-200)] ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              relative flex items-center gap-2 h-11 px-4 text-size-body-small font-medium
              transition-colors duration-[var(--duration-fast)] cursor-pointer
              ${isActive ? 'text-[var(--color-primary-900)]' : 'text-[var(--gray-500)] hover:text-[var(--gray-700)]'}
            `}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            {tab.label}
            {tab.badge != null && (
              <span className={`
                inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-[var(--radius-full)]
                text-size-caption font-semibold
                ${isActive ? 'bg-[var(--color-primary-900)] text-white' : 'bg-[var(--gray-200)] text-[var(--gray-600)]'}
              `}>
                {tab.badge}
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary-900)]" />
            )}
          </button>
        )
      })}
    </div>
  )
}
