import { Router } from 'express'
import { listAll, listByBoard, create, update, move, remove, archive, unarchive, listArchived } from '../controllers/task-controller'
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
taskRouter.patch('/:id/unarchive', unarchive)
taskRouter.delete('/:id', remove)
