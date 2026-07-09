import type { Response } from 'express'
import type { AuthRequest } from '../middleware/auth'
import { prisma } from '../lib/prisma'
import { notifyOrganizationMembers } from '../lib/notify'

export async function list(req: AuthRequest, res: Response) {
  try {
    const teams = await prisma.team.findMany({
      where: { organizationId: req.organizationId },
      include: { members: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(teams)
  } catch (err) {
    console.error('[TEAMS_LIST]', err)
    res.status(500).json({ error: 'Erro ao listar equipes' })
  }
}

export async function create(req: AuthRequest, res: Response) {
  try {
    const { name, description } = req.body
    if (!name) {
      res.status(400).json({ error: 'Nome é obrigatório' })
      return
    }
    const team = await prisma.team.create({
      data: { name, description: description ?? '', organizationId: req.organizationId! },
      include: { members: true },
    })
    res.status(201).json(team)
  } catch (err) {
    console.error('[TEAMS_CREATE]', err)
    res.status(500).json({ error: 'Erro ao criar equipe' })
  }
}

export async function update(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string
    const { name, description } = req.body
    const team = await prisma.team.findFirst({
      where: { id, organizationId: req.organizationId },
    })
    if (!team) {
      res.status(404).json({ error: 'Equipe não encontrada' })
      return
    }
    const updated = await prisma.team.update({
      where: { id },
      data: { name, description },
      include: { members: true },
    })
    res.json(updated)
  } catch (err) {
    console.error('[TEAMS_UPDATE]', err)
    res.status(500).json({ error: 'Erro ao atualizar equipe' })
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string
    const team = await prisma.team.findFirst({
      where: { id, organizationId: req.organizationId },
    })
    if (!team) {
      res.status(404).json({ error: 'Equipe não encontrada' })
      return
    }
    await prisma.team.delete({ where: { id } })
    res.status(204).send()
  } catch (err) {
    console.error('[TEAMS_DELETE]', err)
    res.status(500).json({ error: 'Erro ao excluir equipe' })
  }
}

export async function addMember(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string
    const { name, email, role } = req.body
    if (!name) {
      res.status(400).json({ error: 'Nome é obrigatório' })
      return
    }
    const team = await prisma.team.findFirst({
      where: { id, organizationId: req.organizationId },
    })
    if (!team) {
      res.status(404).json({ error: 'Equipe não encontrada' })
      return
    }
    const member = await prisma.teamMember.create({
      data: { teamId: id, name, email: email ?? '', role: role ?? '' },
    })

    await notifyOrganizationMembers({
      organizationId: req.organizationId!,
      excludeUserId: req.userId!,
      type: 'member_added',
      title: 'Novo membro',
      message: `${name} foi adicionado à equipe "${team.name}"`,
    })

    res.status(201).json(member)
  } catch (err) {
    console.error('[TEAMS_ADD_MEMBER]', err)
    res.status(500).json({ error: 'Erro ao adicionar membro' })
  }
}

export async function removeMember(req: AuthRequest, res: Response) {
  try {
    const memberId = req.params.memberId as string
    const member = await prisma.teamMember.findUnique({
      where: { id: memberId },
      include: { team: { select: { organizationId: true } } },
    })
    if (!member || member.team.organizationId !== req.organizationId) {
      res.status(404).json({ error: 'Membro não encontrado' })
      return
    }
    await prisma.teamMember.delete({ where: { id: memberId } })
    res.status(204).send()
  } catch (err) {
    console.error('[TEAMS_REMOVE_MEMBER]', err)
    res.status(500).json({ error: 'Erro ao remover membro' })
  }
}
