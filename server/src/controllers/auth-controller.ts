import type { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'
import { generateToken } from '../utils/token'

const DEFAULT_ORG_ID = '00000000-0000-0000-0000-000000000001'

async function getOrCreateDefaultOrg(): Promise<string> {
  let org = await prisma.organization.findUnique({ where: { id: DEFAULT_ORG_ID } })
  if (!org) {
    org = await prisma.organization.create({
      data: { id: DEFAULT_ORG_ID, name: 'CA3 Educ' },
    })
  }
  return org.id
}

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Nome, email e senha são obrigatórios' })
      return
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      res.status(409).json({ error: 'Email já cadastrado' })
      return
    }

    const orgId = await getOrCreateDefaultOrg()
    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashed, organizationId: orgId },
    })

    const token = generateToken(user.id, user.organizationId)
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, organizationId: user.organizationId },
    })
  } catch (err) {
    console.error('[REGISTER]', err)
    res.status(500).json({ error: 'Erro ao registrar' })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400).json({ error: 'Email e senha são obrigatórios' })
      return
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      res.status(401).json({ error: 'Credenciais inválidas' })
      return
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      res.status(401).json({ error: 'Credenciais inválidas' })
      return
    }

    const token = generateToken(user.id, user.organizationId)
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, organizationId: user.organizationId },
    })
  } catch (err) {
    console.error('[LOGIN]', err)
    res.status(500).json({ error: 'Erro ao fazer login' })
  }
}

export async function me(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado' })
      return
    }
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, organizationId: user.organizationId })
  } catch (err) {
    console.error('[ME]', err)
    res.status(500).json({ error: 'Erro ao buscar usuário' })
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const { senhaAtual, novaSenha } = req.body

    if (!senhaAtual || !novaSenha) {
      res.status(400).json({ erro: 'Senha atual e nova senha são obrigatórias' })
      return
    }

    if (novaSenha.length < 8) {
      res.status(400).json({ erro: 'Nova senha deve ter no mínimo 8 caracteres' })
      return
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      res.status(404).json({ erro: 'Usuário não encontrado' })
      return
    }

    const valid = await bcrypt.compare(senhaAtual, user.password)
    if (!valid) {
      res.status(401).json({ erro: 'Senha atual incorreta' })
      return
    }

    const hashed = await bcrypt.hash(novaSenha, 10)
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    })
    // TODO: invalidar sessões antigas ao trocar senha

    res.json({ mensagem: 'Senha atualizada com sucesso' })
  } catch (err) {
    console.error('[CHANGE_PASSWORD]', err)
    res.status(500).json({ erro: 'Erro ao atualizar senha' })
  }
}
