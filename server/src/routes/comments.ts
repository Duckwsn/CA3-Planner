import { Router } from 'express'
import { listByTask, create } from '../controllers/comment-controller'
import { authenticate } from '../middleware/auth'

export const commentRouter = Router()

commentRouter.use(authenticate)
commentRouter.get('/task/:taskId', listByTask)
commentRouter.post('/', create)
