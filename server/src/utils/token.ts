import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'fallback-secret'

export function generateToken(id: string, organizationId: string): string {
  return jwt.sign({ id, organizationId }, JWT_SECRET, { expiresIn: '7d' })
}
