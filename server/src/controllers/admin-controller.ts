import type { Response } from 'express'
import type { AuthRequest } from '../middleware/auth'
import { prisma } from '../lib/prisma'
import { isAdminUser } from '../middleware/admin'
import bcrypt from 'bcryptjs'

const ADMIN_TABLES = [
  'User',
  'Organization',
  'Board',
  'Task',
  'Team',
  'TeamMember',
  'Notification',
  'ChecklistItem',
  'Comment',
  'Attachment',
]

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatar: true,
  organizationId: true,
  createdAt: true,
  updatedAt: true,
}

function getModel(name: string) {
  return ADMIN_TABLES.includes(name) ? (prisma as Record<string, any>)[name] : null
}

function jsonSafe(value: unknown) {
  return JSON.parse(JSON.stringify(value, (_key, v) => (typeof v === 'bigint' ? Number(v) : v)))
}

export async function access(req: AuthRequest, res: Response) {
  try {
    res.json({ isAdmin: await isAdminUser(req.userId!) })
  } catch (err) {
    console.error('[ADMIN_ACCESS]', err)
    res.status(500).json({ error: 'Erro ao verificar acesso' })
  }
}

export async function stats(_req: AuthRequest, res: Response) {
  try {
    const counts: Record<string, number> = {}
    for (const model of ADMIN_TABLES) {
      counts[model] = await (prisma as Record<string, any>)[model].count()
    }
    res.json(counts)
  } catch (err) {
    console.error('[ADMIN_STATS]', err)
    res.status(500).json({ error: 'Erro ao obter estatísticas' })
  }
}

// ---------- Usuários ----------

export async function listUsers(_req: AuthRequest, res: Response) {
  try {
    const users = await prisma.user.findMany({
      select: USER_SELECT,
      orderBy: { createdAt: 'desc' },
    })
    const orgs = await prisma.organization.findMany({ select: { id: true, name: true } })
    const orgMap = new Map(orgs.map((o) => [o.id, o.name]))
    res.json(users.map((u) => ({ ...u, organizationName: orgMap.get(u.organizationId) ?? '' })))
  } catch (err) {
    console.error('[ADMIN_USERS_LIST]', err)
    res.status(500).json({ error: 'Erro ao listar usuários' })
  }
}

export async function createUser(req: AuthRequest, res: Response) {
  try {
    const { name, email, password, role, avatar, organizationId } = req.body
    if (!name?.trim() || !email?.trim() || !password) {
      res.status(400).json({ error: 'Nome, email e senha são obrigatórios' })
      return
    }
    if (password.length < 6) {
      res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' })
      return
    }
    const org = organizationId
      ? await prisma.organization.findUnique({ where: { id: organizationId } })
      : null
    if (!org) {
      res.status(400).json({ error: 'Organização não encontrada' })
      return
    }
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: await bcrypt.hash(password, 10),
        role: role ?? 'Membro',
        avatar: avatar ?? '',
        organizationId: org.id,
      },
      select: USER_SELECT,
    })
    res.status(201).json(user)
  } catch (err: any) {
    if (err?.code === 'P2002') {
      res.status(409).json({ error: 'Email já cadastrado' })
      return
    }
    console.error('[ADMIN_USERS_CREATE]', err)
    res.status(500).json({ error: 'Erro ao criar usuário' })
  }
}

export async function updateUser(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string
    const { name, email, role, avatar, organizationId } = req.body
    const existing = await prisma.user.findUnique({ where: { id } })
    if (!existing) {
      res.status(404).json({ error: 'Usuário não encontrado' })
      return
    }
    const data: Record<string, unknown> = {}
    if (name !== undefined) data.name = name.trim()
    if (email !== undefined) data.email = email.trim().toLowerCase()
    if (role !== undefined) data.role = role
    if (avatar !== undefined) data.avatar = avatar
    if (organizationId !== undefined) data.organizationId = organizationId
    const user = await prisma.user.update({
      where: { id },
      data,
      select: USER_SELECT,
    })
    res.json(user)
  } catch (err: any) {
    if (err?.code === 'P2002') {
      res.status(409).json({ error: 'Email já cadastrado' })
      return
    }
    console.error('[ADMIN_USERS_UPDATE]', err)
    res.status(500).json({ error: 'Erro ao atualizar usuário' })
  }
}

export async function deleteUser(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string
    if (id === req.userId) {
      res.status(400).json({ error: 'Você não pode apagar a si mesmo' })
      return
    }
    const existing = await prisma.user.findUnique({ where: { id } })
    if (!existing) {
      res.status(404).json({ error: 'Usuário não encontrado' })
      return
    }
    await prisma.user.delete({ where: { id } })
    res.status(204).send()
  } catch (err) {
    console.error('[ADMIN_USERS_DELETE]', err)
    res.status(500).json({ error: 'Erro ao excluir usuário' })
  }
}

export async function resetPassword(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string
    const { password } = req.body
    if (!password || password.length < 6) {
      res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' })
      return
    }
    const existing = await prisma.user.findUnique({ where: { id } })
    if (!existing) {
      res.status(404).json({ error: 'Usuário não encontrado' })
      return
    }
    await prisma.user.update({
      where: { id },
      data: { password: await bcrypt.hash(password, 10) },
    })
    res.status(204).send()
  } catch (err) {
    console.error('[ADMIN_USERS_RESET_PASSWORD]', err)
    res.status(500).json({ error: 'Erro ao resetar senha' })
  }
}

// ---------- Organizações ----------

export async function listOrganizations(_req: AuthRequest, res: Response) {
  try {
    const orgs = await prisma.organization.findMany({
      include: {
        _count: { select: { users: true, boards: true, teams: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(orgs)
  } catch (err) {
    console.error('[ADMIN_ORGS_LIST]', err)
    res.status(500).json({ error: 'Erro ao listar organizações' })
  }
}

export async function createOrganization(req: AuthRequest, res: Response) {
  try {
    const { name } = req.body
    if (!name?.trim()) {
      res.status(400).json({ error: 'Nome é obrigatório' })
      return
    }
    const org = await prisma.organization.create({ data: { name: name.trim() } })
    res.status(201).json(org)
  } catch (err) {
    console.error('[ADMIN_ORGS_CREATE]', err)
    res.status(500).json({ error: 'Erro ao criar organização' })
  }
}

export async function updateOrganization(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string
    const { name } = req.body
    const existing = await prisma.organization.findUnique({ where: { id } })
    if (!existing) {
      res.status(404).json({ error: 'Organização não encontrada' })
      return
    }
    const org = await prisma.organization.update({
      where: { id },
      data: { name: name?.trim() ?? existing.name },
    })
    res.json(org)
  } catch (err) {
    console.error('[ADMIN_ORGS_UPDATE]', err)
    res.status(500).json({ error: 'Erro ao atualizar organização' })
  }
}

export async function deleteOrganization(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string
    const existing = await prisma.organization.findUnique({ where: { id } })
    if (!existing) {
      res.status(404).json({ error: 'Organização não encontrada' })
      return
    }
    const myUser = await prisma.user.findUnique({ where: { id: req.userId } })
    if (myUser?.organizationId === id) {
      res.status(400).json({ error: 'Você não pode excluir a organização em que está logado' })
      return
    }
    await prisma.organization.delete({ where: { id } })
    res.status(204).send()
  } catch (err) {
    console.error('[ADMIN_ORGS_DELETE]', err)
    res.status(500).json({ error: 'Erro ao excluir organização' })
  }
}

// ---------- Tabelas genéricas ----------

export async function listTables(_req: AuthRequest, res: Response) {
  try {
    const tables = []
    for (const model of ADMIN_TABLES) {
      const total = await (prisma as Record<string, any>)[model].count()
      tables.push({ name: model, rows: total })
    }
    res.json(tables)
  } catch (err) {
    console.error('[ADMIN_TABLES_LIST]', err)
    res.status(500).json({ error: 'Erro ao listar tabelas' })
  }
}

export async function listTableRows(req: AuthRequest, res: Response) {
  try {
    const name = req.params.name as string
    const model = getModel(name)
    if (!model) {
      res.status(404).json({ error: 'Tabela não encontrada' })
      return
    }
    const limit = Math.min(Number(req.query.limit) || 100, 500)
    const offset = Number(req.query.offset) || 0
    const rows = await model.findMany({ take: limit, skip: offset, orderBy: { id: 'asc' } })
    const total = await model.count()
    res.json({ rows: jsonSafe(rows), total })
  } catch (err) {
    console.error('[ADMIN_TABLES_ROWS]', err)
    res.status(500).json({ error: 'Erro ao listar linhas' })
  }
}

export async function createTableRow(req: AuthRequest, res: Response) {
  try {
    const name = req.params.name as string
    const model = getModel(name)
    if (!model) {
      res.status(404).json({ error: 'Tabela não encontrada' })
      return
    }
    const row = await model.create({ data: req.body })
    res.status(201).json(jsonSafe(row))
  } catch (err: any) {
    console.error('[ADMIN_TABLES_CREATE]', err)
    res.status(400).json({ error: err?.message ?? 'Erro ao criar linha' })
  }
}

export async function updateTableRow(req: AuthRequest, res: Response) {
  try {
    const name = req.params.name as string
    const id = req.params.id as string
    const model = getModel(name)
    if (!model) {
      res.status(404).json({ error: 'Tabela não encontrada' })
      return
    }
    const row = await model.update({ where: { id }, data: req.body })
    res.json(jsonSafe(row))
  } catch (err: any) {
    console.error('[ADMIN_TABLES_UPDATE]', err)
    res.status(400).json({ error: err?.message ?? 'Erro ao atualizar linha' })
  }
}

export async function deleteTableRow(req: AuthRequest, res: Response) {
  try {
    const name = req.params.name as string
    const id = req.params.id as string
    const model = getModel(name)
    if (!model) {
      res.status(404).json({ error: 'Tabela não encontrada' })
      return
    }
    if (name === 'User' && id === req.userId) {
      res.status(400).json({ error: 'Você não pode apagar a si mesmo' })
      return
    }
    await model.delete({ where: { id } })
    res.status(204).send()
  } catch (err: any) {
    console.error('[ADMIN_TABLES_DELETE]', err)
    res.status(400).json({ error: err?.message ?? 'Erro ao excluir linha' })
  }
}

// ---------- Console SQL ----------

export async function runSql(_req: AuthRequest, res: Response) {
  try {
    const { query } = _req.body ?? {}
    const q = (query ?? '').trim()
    if (!q) {
      res.status(400).json({ error: 'Query obrigatória' })
      return
    }
    const isRead = /^(select|show|explain|describe|pragma|with)\b/i.test(q)
    if (isRead) {
      const rows = await prisma.$queryRawUnsafe(q)
      res.json({ rows: jsonSafe(rows), readOnly: true })
    } else {
      const rowCount = await prisma.$executeRawUnsafe(q)
      res.json({ rowCount, readOnly: false })
    }
  } catch (err: any) {
    console.error('[ADMIN_SQL]', err)
    res.status(400).json({ error: err?.message ?? 'Erro ao executar query' })
  }
}
