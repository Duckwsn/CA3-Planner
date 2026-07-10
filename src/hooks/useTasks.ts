import { useEffect } from 'react'
import { useTaskStore } from '../stores/domain/taskStore'

export function useTasks(boardId: string) {
  const tasks = useTaskStore((s) => s.tasks)
  const loading = useTaskStore((s) => s.loading)
  const error = useTaskStore((s) => s.error)
  const loadTasks = useTaskStore((s) => s.loadTasks)
  const createTask = useTaskStore((s) => s.addTask)
  const updateTask = useTaskStore((s) => s.updateTask)
  const deleteTask = useTaskStore((s) => s.deleteTask)

  useEffect(() => {
    if (boardId) {
      loadTasks(boardId)
    }
  }, [boardId, loadTasks])

  return { tasks, loading, error, loadTasks, createTask, updateTask, deleteTask }
}
