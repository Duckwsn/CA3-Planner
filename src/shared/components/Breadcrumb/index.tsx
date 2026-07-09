import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-size-caption text-[var(--gray-500)]">
      <Link to="/dashboard" className="hover:text-[var(--gray-700)] transition-colors">
        <Home size={14} />
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          <ChevronRight size={12} />
          {item.href ? (
            <Link to={item.href} className="hover:text-[var(--gray-700)] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--gray-700)] font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
