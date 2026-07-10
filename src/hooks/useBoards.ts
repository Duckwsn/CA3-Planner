import { useEffect } from 'react'
import { useBoardStore } from '../stores/domain/boardStore'

export function useBoards() {
  const boards = useBoardStore((s) => s.boards)
  const loading = useBoardStore((s) => s.loading)
  const error = useBoardStore((s) => s.error)
  const loadBoards = useBoardStore((s) => s.loadBoards)
  const createBoard = useBoardStore((s) => s.addBoard)
  const updateBoard = useBoardStore((s) => s.updateBoard)
  const deleteBoard = useBoardStore((s) => s.deleteBoard)

  useEffect(() => {
    if (boards.length === 0 && !loading) {
      loadBoards()
    }
  }, [boards.length, loading, loadBoards])

  return { boards, loading, error, loadBoards, createBoard, updateBoard, deleteBoard }
}

export function useBoard(id: string) {
  const selectedBoard = useBoardStore((s) => s.selectedBoard)
  const loading = useBoardStore((s) => s.loading)
  const error = useBoardStore((s) => s.error)
  const loadBoard = useBoardStore((s) => s.loadBoard)

  useEffect(() => {
    if (id) {
      loadBoard(id)
    }
  }, [id, loadBoard])

  return { board: selectedBoard, loading, error, loadBoard }
}
