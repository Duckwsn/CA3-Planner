import { prisma } from './prisma'

interface NotifyData {
  organizationId: string
  excludeUserId: string
  type: string
  title: string
  message: string
  link?: string
}

export async function notifyOrganizationMembers(data: NotifyData) {
  const users = await prisma.user.findMany({
    where: {
      organizationId: data.organizationId,
      id: { not: data.excludeUserId },
    },
    select: { id: true },
  })

  if (users.length === 0) return

  await prisma.notification.createMany({
    data: users.map((u) => ({
      userId: u.id,
      type: data.type,
      title: data.title,
      message: data.message,
      link: data.link ?? '',
    })),
  })
}
