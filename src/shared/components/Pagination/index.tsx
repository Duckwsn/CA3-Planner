import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PaginationProps } from './Pagination.types'

export function Pagination({ currentPage, totalPages, onPageChange, className = '' }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages: (number | 'dots')[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== 'dots') {
      pages.push('dots')
    }
  }

  return (
    <nav className={`flex items-center justify-center gap-1 ${className}`} aria-label="Paginação">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center justify-center w-9 h-9 rounded-[var(--radius-md)] text-[var(--gray-500)] hover:bg-[var(--gray-100)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        aria-label="Página anterior"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((page, idx) =>
        page === 'dots' ? (
          <span key={`dots-${idx}`} className="flex items-center justify-center w-9 h-9 text-[var(--gray-400)]">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              flex items-center justify-center w-9 h-9 rounded-[var(--radius-md)] text-size-body-small font-medium
              transition-colors cursor-pointer
              ${page === currentPage
                ? 'bg-[var(--color-primary-900)] text-white'
                : 'text-[var(--gray-600)] hover:bg-[var(--gray-100)]'
              }
            `}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex items-center justify-center w-9 h-9 rounded-[var(--radius-md)] text-[var(--gray-500)] hover:bg-[var(--gray-100)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        aria-label="Próxima página"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  )
}
