import cron from 'node-cron'
import { prisma } from '../lib/prisma'

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

export async function purgeOldArchivedTasks() {
  const cutoff = new Date(Date.now() - THIRTY_DAYS_MS)
  const result = await prisma.task.deleteMany({
    where: { archived: true, archivedAt: { lte: cutoff } },
  })
  if (result.count > 0) console.log(`[PURGE_JOB] ${result.count} tarefa(s) excluída(s) permanentemente.`)
}

export function startPurgeJob() {
  cron.schedule('0 4 * * *', purgeOldArchivedTasks)
  purgeOldArchivedTasks()
}
