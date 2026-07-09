import type { Response } from 'express'
import type { AuthRequest } from '../middleware/auth'
import { prisma } from '../lib/prisma'

export async function list(req: AuthRequest, res: Response) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    res.json(notifications)
  } catch (err) {
    console.error('[NOTIFICATIONS_LIST]', err)
    res.status(500).json({ error: 'Erro ao listar notificações' })
  }
}

export async function markRead(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string
    const notification = await prisma.notification.findFirst({
      where: { id, userId: req.userId! },
    })
    if (!notification) {
      res.status(404).json({ error: 'Notificação não encontrada' })
      return
    }
    await prisma.notification.update({
      where: { id },
      data: { read: true },
    })
    res.status(204).send()
  } catch (err) {
    console.error('[NOTIFICATIONS_MARK_READ]', err)
    res.status(500).json({ error: 'Erro ao marcar notificação' })
  }
}

export async function markAllRead(req: AuthRequest, res: Response) {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.userId!, read: false },
      data: { read: true },
    })
    res.status(204).send()
  } catch (err) {
    console.error('[NOTIFICATIONS_MARK_ALL_READ]', err)
    res.status(500).json({ error: 'Erro ao marcar notificações' })
  }
}

export async function unreadCount(req: AuthRequest, res: Response) {
  try {
    const count = await prisma.notification.count({
      where: { userId: req.userId!, read: false },
    })
    res.json({ count })
  } catch (err) {
    console.error('[NOTIFICATIONS_UNREAD_COUNT]', err)
    res.status(500).json({ error: 'Erro ao contar notificações' })
  }
}
