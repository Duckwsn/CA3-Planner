import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const DEFAULT_ORG_ID = '00000000-0000-0000-0000-000000000001'

async function seed() {
  const org = await prisma.organization.upsert({
    where: { id: DEFAULT_ORG_ID },
    update: {},
    create: { id: DEFAULT_ORG_ID, name: 'CA3 Educ' },
  })

  const password = await bcrypt.hash('123456', 10)

  const user = await prisma.user.upsert({
    where: { email: 'admin@escola.edu' },
    update: {},
    create: {
      name: 'Ana Silva',
      email: 'admin@escola.edu',
      password,
      role: 'Coordenadora Pedagógica',
      organizationId: org.id,
    },
  })

  const board1 = await prisma.board.create({
    data: {
      title: 'Matemática - 3º Ano',
      description: 'Quadro de tarefas da disciplina de Matemática',
      color: '#2563eb',
      userId: user.id,
      organizationId: org.id,
    },
  })

  const board2 = await prisma.board.create({
    data: {
      title: 'Português - 2º Ano',
      description: 'Quadro de tarefas da disciplina de Português',
      color: '#059669',
      userId: user.id,
      organizationId: org.id,
    },
  })

  const board3 = await prisma.board.create({
    data: {
      title: 'Ciências - 4º Ano',
      description: 'Quadro de tarefas da disciplina de Ciências',
      color: '#7c3aed',
      userId: user.id,
      organizationId: org.id,
    },
  })

  await prisma.task.createMany({
    data: [
      { boardId: board1.id, title: 'Preparar plano de aula', status: 'doing', priority: 'high', assignee: 'Ana Silva', dueDate: '2026-07-15' },
      { boardId: board1.id, title: 'Corrigir provas', status: 'todo', priority: 'urgent', assignee: 'Carlos', dueDate: '2026-07-10' },
      { boardId: board1.id, title: 'Revisar conteúdo', status: 'review', priority: 'medium', assignee: 'Ana Silva', dueDate: '2026-07-20' },
      { boardId: board2.id, title: 'Elaborar redação modelo', status: 'doing', priority: 'high', assignee: 'Marina', dueDate: '2026-07-18' },
      { boardId: board3.id, title: 'Preparar experimento', status: 'todo', priority: 'medium', dueDate: '2026-07-25' },
    ],
  })

  await prisma.team.create({
    data: {
      name: 'Equipe de Matemática',
      description: 'Professores responsáveis pela disciplina de Matemática',
      organizationId: org.id,
      members: {
        create: [
          { name: 'Carlos Alberto', email: 'carlos@escola.edu', role: 'Professor' },
          { name: 'Marina Silva', email: 'marina@escola.edu', role: 'Professor' },
        ],
      },
    },
  })

  await prisma.team.create({
    data: {
      name: 'Equipe de Português',
      description: 'Professores de Língua Portuguesa',
      organizationId: org.id,
      members: {
        create: [
          { name: 'Juliana Costa', email: 'juliana@escola.edu', role: 'Coordenadora' },
        ],
      },
    },
  })

  console.log('Seed concluído!')
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
