import { ChevronUp, ChevronDown } from 'lucide-react'
import { useState, useMemo } from 'react'
import { LoadingState } from '../LoadingState'
import { EmptyState } from '../EmptyState'
import type { TableProps } from './Table.types'

function TableInner<T extends Record<string, unknown>>({ columns, data, loading, emptyMessage, onRowClick, className = '' }: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const sorted = useMemo(() => {
    if (!sortKey) return data
    return [...data].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (aVal == null) return 1
      if (bVal == null) return -1
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, sortKey, sortDir])

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  if (loading) return <LoadingState message="Carregando dados..." />
  if (!data.length) return <EmptyState message={emptyMessage ?? 'Nenhum registro encontrado.'} />

  return (
    <div className={`overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--gray-200)] ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[var(--gray-50)]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`
                  h-11 px-4 text-left text-size-caption font-semibold text-[var(--gray-600)] uppercase tracking-wider
                  ${col.sortable ? 'cursor-pointer select-none hover:bg-[var(--gray-100)]' : ''}
                  ${col.className ?? ''}
                `}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.header}
                  {col.sortable && sortKey === col.key && (
                    sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--gray-200)]">
          {sorted.map((item, idx) => (
            <tr
              key={(item.id as string) ?? idx}
              onClick={() => onRowClick?.(item)}
              className={`
                bg-[var(--color-bg-surface)] transition-colors
                ${onRowClick ? 'cursor-pointer hover:bg-[var(--gray-50)]' : ''}
              `}
            >
              {columns.map((col) => (
                <td key={col.key} className={`h-12 px-4 text-size-body-small text-[var(--gray-700)] ${col.className ?? ''}`}>
                  {col.render ? col.render(item) : String(item[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Table<T extends Record<string, unknown>>(props: TableProps<T>) {
  return <TableInner {...props} />
}
