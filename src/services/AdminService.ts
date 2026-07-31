import { apiGet, apiPost, apiPatch, apiDelete } from '../core/api/httpClient'
import type {
  AdminStats,
  AdminUser,
  AdminOrganization,
  TableInfo,
  TableRowsResult,
  SqlResult,
} from '../types/admin.types'

export const AdminService = {
  async access(): Promise<{ isAdmin: boolean }> {
    return apiGet('/admin/access')
  },

  async stats(): Promise<AdminStats> {
    return apiGet('/admin/stats')
  },

  async listUsers(): Promise<AdminUser[]> {
    return apiGet('/admin/users')
  },

  async createUser(data: {
    name: string
    email: string
    password: string
    role?: string
    avatar?: string
    organizationId: string
  }): Promise<AdminUser> {
    return apiPost('/admin/users', data)
  },

  async updateUser(id: string, data: Partial<AdminUser>): Promise<AdminUser> {
    return apiPatch(`/admin/users/${id}`, data)
  },

  async deleteUser(id: string): Promise<void> {
    return apiDelete(`/admin/users/${id}`)
  },

  async resetPassword(id: string, password: string): Promise<void> {
    return apiPost(`/admin/users/${id}/password`, { password })
  },

  async listOrganizations(): Promise<AdminOrganization[]> {
    return apiGet('/admin/organizations')
  },

  async createOrganization(name: string) {
    return apiPost('/admin/organizations', { name })
  },

  async updateOrganization(id: string, name: string) {
    return apiPatch(`/admin/organizations/${id}`, { name })
  },

  async deleteOrganization(id: string): Promise<void> {
    return apiDelete(`/admin/organizations/${id}`)
  },

  async listTables(): Promise<TableInfo[]> {
    return apiGet('/admin/tables')
  },

  async getTableRows(name: string, limit = 100, offset = 0): Promise<TableRowsResult> {
    return apiGet(`/admin/tables/${name}`, { params: { limit, offset } })
  },

  async createTableRow(name: string, data: Record<string, unknown>) {
    return apiPost(`/admin/tables/${name}`, data)
  },

  async updateTableRow(name: string, id: string, data: Record<string, unknown>) {
    return apiPatch(`/admin/tables/${name}/${id}`, data)
  },

  async deleteTableRow(name: string, id: string): Promise<void> {
    return apiDelete(`/admin/tables/${name}/${id}`)
  },

  async runSql(query: string): Promise<SqlResult> {
    return apiPost('/admin/sql', { query })
  },
}
