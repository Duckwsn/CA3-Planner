export interface Comment {
  id: string
  taskId: string
  userId: string
  content: string
  createdAt: string
  user?: { id: string; name: string; avatar: string }
}
