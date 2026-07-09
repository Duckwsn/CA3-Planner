const STORAGE_KEY = 'ca3_date_format'

export function getDateFormat(): string {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(STORAGE_KEY) || 'dd/mm/aaaa'
  }
  return 'dd/mm/aaaa'
}

export function setDateFormat(format: string): void {
  window.localStorage.setItem(STORAGE_KEY, format)
}

export function formatDate(value: string | Date, _locale = 'pt-BR'): string {
  if (!value) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  if (isNaN(date.getTime())) return ''

  const fmt = getDateFormat()
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  switch (fmt) {
    case 'mm/dd/aaaa':
      return `${month}/${day}/${year}`
    case 'dd/mm/aaaa':
    default:
      return `${day}/${month}/${year}`
  }
}

export function formatDateTime(value: string | Date, locale = 'pt-BR'): string {
  if (!value) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  if (isNaN(date.getTime())) return ''

  const time = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
  return `${formatDate(date, locale)} ${time}`
}
