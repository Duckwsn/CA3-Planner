export interface Notification {
  id: string
  userId: string
  type: 'task_created' | 'task_moved' | 'task_due' | 'task_overdue' | 'member_added' | 'comment_created'
  title: string
  message: string
  link: string
  read: boolean
  createdAt: string
}
