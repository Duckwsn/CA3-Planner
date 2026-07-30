import { Router } from 'express'
import { listAll, listByBoard, create, update, move, remove, archive, listArchived } from '../controllers/task-controller'
import { authenticate } from '../middleware/auth'

export const taskRouter = Router()

taskRouter.use(authenticate)
taskRouter.get('/', listAll)
taskRouter.get('/board/:boardId', listByBoard)
taskRouter.get('/archived', listArchived)
taskRouter.post('/', create)
taskRouter.put('/:id', update)
taskRouter.patch('/:id/move', move)
taskRouter.patch('/:id/archive', archive)
taskRouter.delete('/:id', remove)
