import type { Response } from 'express'
import type { AuthRequest } from '../middleware/auth'
import { prisma } from '../lib/prisma'

export async function list(req: AuthRequest, res: Response) {
  try {
    const boards = await prisma.board.findMany({
      where: { organizationId: req.organizationId },
      include: { _count: { select: { tasks: true } } },
      orderBy: { createdAt: 'desc' },
    })
    res.json(boards)
  } catch (err) {
    console.error('[BOARDS_LIST]', err)
    res.status(500).json({ error: 'Erro ao listar quadros' })
  }
}

export async function getById(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string
    const board = await prisma.board.findFirst({
      where: { id, organizationId: req.organizationId },
      include: { _count: { select: { tasks: true } } },
    })
    if (!board) {
      res.status(404).json({ error: 'Quadro não encontrado' })
      return
    }
    res.json(board)
  } catch (err) {
    console.error('[BOARDS_GET]', err)
    res.status(500).json({ error: 'Erro ao buscar quadro' })
  }
}

export async function create(req: AuthRequest, res: Response) {
  try {
    const { title, description, color } = req.body
    if (!title) {
      res.status(400).json({ error: 'Título é obrigatório' })
      return
    }
    const board = await prisma.board.create({
      data: { title, description: description ?? '', color: color ?? '#2563eb', userId: req.userId!, organizationId: req.organizationId! },
    })
    res.status(201).json(board)
  } catch (err) {
    console.error('[BOARDS_CREATE]', err)
    res.status(500).json({ error: 'Erro ao criar quadro' })
  }
}

export async function update(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string
    const { title, description, color } = req.body
    const board = await prisma.board.findFirst({
      where: { id, organizationId: req.organizationId },
    })
    if (!board) {
      res.status(404).json({ error: 'Quadro não encontrado' })
      return
    }
    const updated = await prisma.board.update({
      where: { id },
      data: { title, description, color },
    })
    res.json(updated)
  } catch (err) {
    console.error('[BOARDS_UPDATE]', err)
    res.status(500).json({ error: 'Erro ao atualizar quadro' })
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string
    const board = await prisma.board.findFirst({
      where: { id, organizationId: req.organizationId },
    })
    if (!board) {
      res.status(404).json({ error: 'Quadro não encontrado' })
      return
    }
    await prisma.board.delete({ where: { id } })
    res.status(204).send()
  } catch (err) {
    console.error('[BOARDS_DELETE]', err)
    res.status(500).json({ error: 'Erro ao excluir quadro' })
  }
}
