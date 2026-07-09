import type { Response } from 'express'
import type { AuthRequest } from '../middleware/auth'
import { prisma } from '../lib/prisma'

export async function listByTask(req: AuthRequest, res: Response) {
  try {
    const taskId = req.params.taskId as string
    const attachments = await prisma.attachment.findMany({
      where: { taskId },
      orderBy: { createdAt: 'desc' },
    })
    res.json(attachments)
  } catch (err) {
    console.error('[ATTACHMENTS_LIST]', err)
    res.status(500).json({ error: 'Erro ao listar anexos' })
  }
}

export async function upload(req: AuthRequest, res: Response) {
  try {
    const { taskId } = req.body
    const file = req.file
    if (!file) {
      res.status(400).json({ error: 'Arquivo é obrigatório' })
      return
    }

    const attachment = await prisma.attachment.create({
      data: {
        taskId,
        userId: req.userId!,
        name: file.originalname,
        size: file.size,
        type: file.mimetype,
        url: `/uploads/${file.filename}`,
      },
    })
    res.status(201).json(attachment)
  } catch (err) {
    console.error('[ATTACHMENTS_UPLOAD]', err)
    res.status(500).json({ error: 'Erro ao fazer upload' })
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string
    await prisma.attachment.delete({ where: { id } })
    res.status(204).send()
  } catch (err) {
    console.error('[ATTACHMENTS_DELETE]', err)
    res.status(500).json({ error: 'Erro ao excluir anexo' })
  }
}
