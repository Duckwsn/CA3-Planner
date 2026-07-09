import { Router } from 'express'
import { listByTask, create, toggle, remove } from '../controllers/checklist-controller'
import { authenticate } from '../middleware/auth'

export const checklistRouter = Router()

checklistRouter.use(authenticate)
checklistRouter.get('/task/:taskId', listByTask)
checklistRouter.post('/', create)
checklistRouter.patch('/:id/toggle', toggle)
checklistRouter.delete('/:id', remove)
