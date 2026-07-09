import type { Response } from 'express'
import type { AuthRequest } from '../middleware/auth'
import { prisma } from '../lib/prisma'
import { notifyOrganizationMembers } from '../lib/notify'

export async function listByTask(req: AuthRequest, res: Response) {
  try {
    const taskId = req.params.taskId as string
    const comments = await prisma.comment.findMany({
      where: { taskId },
      include: { user: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'asc' },
    })
    res.json(comments)
  } catch (err) {
    console.error('[COMMENTS_LIST]', err)
    res.status(500).json({ error: 'Erro ao listar comentários' })
  }
}

export async function create(req: AuthRequest, res: Response) {
  try {
    const { taskId, content } = req.body
    if (!content) {
      res.status(400).json({ error: 'Conteúdo é obrigatório' })
      return
    }
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { board: { select: { title: true, organizationId: true } } },
    })

    const comment = await prisma.comment.create({
      data: { taskId, userId: req.userId!, content },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    })

    if (task) {
      await notifyOrganizationMembers({
        organizationId: task.board.organizationId,
        excludeUserId: req.userId!,
        type: 'comment_created',
        title: 'Novo comentário',
        message: `${comment.user.name} comentou em "${task.title}"`,
        link: `/boards/${task.boardId}`,
      })
    }

    res.status(201).json(comment)
  } catch (err) {
    console.error('[COMMENTS_CREATE]', err)
    res.status(500).json({ error: 'Erro ao criar comentário' })
  }
}
