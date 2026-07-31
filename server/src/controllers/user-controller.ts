import type { Response } from 'express'
import type { AuthRequest } from '../middleware/auth'
import { prisma } from '../lib/prisma'

export async function list(req: AuthRequest, res: Response) {
  try {
    const users = await prisma.user.findMany({
      where: { organizationId: req.organizationId },
      select: { id: true, name: true, email: true, role: true, avatar: true },
      orderBy: { name: 'asc' },
    })
    res.json(users)
  } catch (err) {
    console.error('[USERS_LIST]', err)
    res.status(500).json({ error: 'Erro ao listar usuários' })
  }
}
