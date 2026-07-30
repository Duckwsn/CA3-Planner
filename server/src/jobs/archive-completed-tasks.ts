import cron from 'node-cron'
import { prisma } from '../lib/prisma'

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000

export async function archiveOldCompletedTasks() {
  const cutoff = new Date(Date.now() - TWO_DAYS_MS)
  const result = await prisma.task.updateMany({
    where: { status: 'done', archived: false, completedAt: { lte: cutoff } },
    data: { archived: true, archivedAt: new Date() },
  })
  if (result.count > 0) console.log(`[ARCHIVE_JOB] ${result.count} tarefa(s) arquivada(s).`)
}

export function startArchiveJob() {
  cron.schedule('0 3 * * *', archiveOldCompletedTasks)
  archiveOldCompletedTasks()
}
