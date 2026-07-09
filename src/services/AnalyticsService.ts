import { apiGet } from '../core/api/httpClient'

interface DashboardKPIs {
  totalBoards: number
  totalTasks: number
  completedTasks: number
  overdueTasks: number
  tasksByStatus: Record<string, number>
  tasksByPriority: Record<string, number>
  tasksByBoard: { boardId: string; boardTitle: string; count: number }[]
  completionRate: number
}

export const AnalyticsService = {
  async getDashboardKPIs(): Promise<DashboardKPIs> {
    return apiGet<DashboardKPIs>('/analytics/dashboard')
  },
}
