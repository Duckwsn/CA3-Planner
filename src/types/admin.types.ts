export interface AdminStats {
  User: number
  Organization: number
  Board: number
  Task: number
  Team: number
  TeamMember: number
  Notification: number
  ChecklistItem: number
  Comment: number
  Attachment: number
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  organizationId: string
  createdAt: string
  updatedAt: string
  organizationName?: string
}

export interface AdminOrganization {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  _count: { users: number; boards: number; teams: number }
}

export interface TableInfo {
  name: string
  rows: number
}

export interface TableRowsResult {
  rows: Record<string, unknown>[]
  total: number
}

export interface SqlResult {
  rows?: Record<string, unknown>[]
  rowCount?: number
  readOnly: boolean
}
