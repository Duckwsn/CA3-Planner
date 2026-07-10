import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { authRouter } from './routes/auth'
import { boardRouter } from './routes/boards'
import { taskRouter } from './routes/tasks'
import { teamRouter } from './routes/teams'
import { commentRouter } from './routes/comments'
import { checklistRouter } from './routes/checklist'
import { attachmentRouter } from './routes/attachments'
import { notificationRouter } from './routes/notifications'
import { errorHandler } from './middleware/error-handler'
import path from 'node:path'
import { prisma } from './lib/prisma'
import { seedDatabase } from './db/seed'

const app = express()
const PORT = process.env.PORT ?? 3001
const isProd = process.env.NODE_ENV === 'production'

app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}))
app.use(morgan(isProd ? 'combined' : 'dev'))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRouter)
app.use('/api/boards', boardRouter)
app.use('/api/tasks', taskRouter)
app.use('/api/teams', teamRouter)
app.use('/api/comments', commentRouter)
app.use('/api/checklist', checklistRouter)
app.use('/api/attachments', attachmentRouter)
app.use('/api/notifications', notificationRouter)
app.use('/uploads', express.static('uploads'))

if (isProd) {
  const distPath = path.resolve(__dirname, '../../dist')
  app.use(express.static(distPath))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.use(errorHandler)

async function startup() {
  if (isProd) {
    try {
      const seeded = await seedDatabase(prisma)
      if (seeded) console.log('Banco de dados populado automaticamente')
    } catch (err) {
      console.error('Erro ao executar seed automático:', err)
    }
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} (${isProd ? 'production' : 'development'})`)
  })
}

startup()
