import type { Response, NextFunction } from 'express'
import type { AuthRequest } from './auth'
import { prisma } from '../lib/prisma'

function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? ''
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export async function isAdminUser(userId: string): Promise<boolean> {
  const admins = getAdminEmails()
  if (admins.length === 0) return false
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return false
  return admins.includes(user.email.toLowerCase())
}

export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const allowed = await isAdminUser(req.userId!)
    if (!allowed) {
      res.status(403).json({ error: 'Acesso negado' })
      return
    }
    next()
  } catch (err) {
    console.error('[ADMIN_MIDDLEWARE]', err)
    res.status(500).json({ error: 'Erro ao verificar permissão de admin' })
  }
}
