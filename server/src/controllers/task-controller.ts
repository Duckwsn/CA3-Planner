import type { Response } from 'express'
import type { AuthRequest } from '../middleware/auth'
import { prisma } from '../lib/prisma'
import { notifyOrganizationMembers } from '../lib/notify'

export async function listAll(req: AuthRequest, res: Response) {
  try {
    const tasks = await prisma.task.findMany({
      where: { board: { organizationId: req.organizationId } },
      include: { board: { select: { id: true, title: true, color: true } } },
      orderBy: { createdAt: 'desc' },
    })
    res.json(tasks)
  } catch (err) {
    console.error('[TASKS_LIST_ALL]', err)
    res.status(500).json({ error: 'Erro ao listar tarefas' })
  }
}

export async function listByBoard(req: AuthRequest, res: Response) {
  try {
    const boardId = req.params.boardId as string
    const board = await prisma.board.findFirst({
      where: { id: boardId, organizationId: req.organizationId },
    })
    if (!board) {
      res.status(404).json({ error: 'Quadro não encontrado' })
      return
    }
    const tasks = await prisma.task.findMany({
      where: { boardId },
      orderBy: { createdAt: 'asc' },
    })
    res.json(tasks)
  } catch (err) {
    console.error('[TASKS_LIST]', err)
    res.status(500).json({ error: 'Erro ao listar tarefas' })
  }
}

export async function create(req: AuthRequest, res: Response) {
  try {
    const { boardId, title, description, priority, assignee, dueDate } = req.body
    if (!title || !boardId) {
      res.status(400).json({ error: 'Título e boardId são obrigatórios' })
      return
    }
    const board = await prisma.board.findFirst({
      where: { id: boardId, organizationId: req.organizationId },
    })
    if (!board) {
      res.status(404).json({ error: 'Quadro não encontrado' })
      return
    }
    const task = await prisma.task.create({
      data: {
        boardId,
        title,
        description: description ?? '',
        priority: priority ?? 'medium',
        assignee: assignee ?? '',
        dueDate: dueDate ?? '',
      },
    })

    await notifyOrganizationMembers({
      organizationId: req.organizationId!,
      excludeUserId: req.userId!,
      type: 'task_created',
      title: 'Nova tarefa',
      message: `"${task.title}" foi criada em "${board.title}"`,
      link: `/boards/${boardId}`,
    })

    res.status(201).json(task)
  } catch (err) {
    console.error('[TASKS_CREATE]', err)
    res.status(500).json({ error: 'Erro ao criar tarefa' })
  }
}

export async function update(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string
    const { title, description, status, priority, assignee, dueDate } = req.body
    const task = await prisma.task.findUnique({
      where: { id },
      include: { board: { select: { organizationId: true } } },
    })
    if (!task || task.board.organizationId !== req.organizationId) {
      res.status(404).json({ error: 'Tarefa não encontrada' })
      return
    }
    const board = await prisma.board.findUnique({
      where: { id: task.boardId },
      select: { title: true },
    })

    const updated = await prisma.task.update({
      where: { id },
      data: { title, description, status, priority, assignee, dueDate },
    })

    await notifyOrganizationMembers({
      organizationId: req.organizationId!,
      excludeUserId: req.userId!,
      type: 'task_moved',
      title: 'Tarefa atualizada',
      message: `"${updated.title}" foi atualizada em "${board?.title ?? 'Quadro'}"`,
      link: `/board/${task.boardId}`,
    })

    res.json(updated)
  } catch (err) {
    console.error('[TASKS_UPDATE]', err)
    res.status(500).json({ error: 'Erro ao atualizar tarefa' })
  }
}

export async function move(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string
    const { status } = req.body
    const task = await prisma.task.findUnique({
      where: { id },
      include: { board: { select: { organizationId: true } } },
    })
    if (!task || task.board.organizationId !== req.organizationId) {
      res.status(404).json({ error: 'Tarefa não encontrada' })
      return
    }
    const board = await prisma.board.findUnique({
      where: { id: task.boardId },
      select: { title: true },
    })

    const updated = await prisma.task.update({
      where: { id },
      data: { status },
    })

    const statusLabel: Record<string, string> = { todo: 'A fazer', doing: 'Fazendo', done: 'Concluído' }

    await notifyOrganizationMembers({
      organizationId: req.organizationId!,
      excludeUserId: req.userId!,
      type: 'task_moved',
      title: 'Tarefa movida',
      message: `"${updated.title}" foi movida para "${statusLabel[status] ?? status}" em "${board?.title ?? 'Quadro'}"`,
      link: `/board/${task.boardId}`,
    })

    res.json(updated)
  } catch (err) {
    console.error('[TASKS_MOVE]', err)
    res.status(500).json({ error: 'Erro ao mover tarefa' })
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string
    const task = await prisma.task.findUnique({
      where: { id },
      include: { board: { select: { organizationId: true } } },
    })
    if (!task || task.board.organizationId !== req.organizationId) {
      res.status(404).json({ error: 'Tarefa não encontrada' })
      return
    }
    await prisma.task.delete({ where: { id } })
    res.status(204).send()
  } catch (err) {
    console.error('[TASKS_DELETE]', err)
    res.status(500).json({ error: 'Erro ao excluir tarefa' })
  }
}
