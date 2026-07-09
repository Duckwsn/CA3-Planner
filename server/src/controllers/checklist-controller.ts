import type { Response } from 'express'
import type { AuthRequest } from '../middleware/auth'
import { prisma } from '../lib/prisma'

export async function listByTask(req: AuthRequest, res: Response) {
  try {
    const taskId = req.params.taskId as string
    const items = await prisma.checklistItem.findMany({
      where: { taskId },
      orderBy: { createdAt: 'asc' },
    })
    res.json(items)
  } catch (err) {
    console.error('[CHECKLIST_LIST]', err)
    res.status(500).json({ error: 'Erro ao listar checklist' })
  }
}

export async function create(req: AuthRequest, res: Response) {
  try {
    const { taskId, text } = req.body
    if (!text) {
      res.status(400).json({ error: 'Texto é obrigatório' })
      return
    }
    const item = await prisma.checklistItem.create({
      data: { taskId, text, checked: false },
    })
    res.status(201).json(item)
  } catch (err) {
    console.error('[CHECKLIST_CREATE]', err)
    res.status(500).json({ error: 'Erro ao criar item' })
  }
}

export async function toggle(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string
    const item = await prisma.checklistItem.findUnique({ where: { id } })
    if (!item) {
      res.status(404).json({ error: 'Item não encontrado' })
      return
    }
    const updated = await prisma.checklistItem.update({
      where: { id },
      data: { checked: !item.checked },
    })
    res.json(updated)
  } catch (err) {
    console.error('[CHECKLIST_TOGGLE]', err)
    res.status(500).json({ error: 'Erro ao alternar item' })
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string
    await prisma.checklistItem.delete({ where: { id } })
    res.status(204).send()
  } catch (err) {
    console.error('[CHECKLIST_DELETE]', err)
    res.status(500).json({ error: 'Erro ao excluir item' })
  }
}
