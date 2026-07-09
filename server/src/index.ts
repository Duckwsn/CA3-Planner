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

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(helmet())
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(morgan('dev'))
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

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
