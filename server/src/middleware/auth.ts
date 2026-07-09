import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'fallback-secret'

export interface AuthRequest extends Request {
  userId?: string
  organizationId?: string
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token não fornecido' })
    return
  }

  const token = header.split(' ')[1]
  if (!token) {
    res.status(401).json({ error: 'Token inválido' })
    return
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; organizationId: string }
    req.userId = decoded.id
    req.organizationId = decoded.organizationId
    next()
  } catch {
    res.status(401).json({ error: 'Token expirado ou inválido' })
  }
}
