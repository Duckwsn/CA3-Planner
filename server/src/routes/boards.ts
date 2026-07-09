import { Router } from 'express'
import { list, getById, create, update, remove } from '../controllers/board-controller'
import { authenticate } from '../middleware/auth'

export const boardRouter = Router()

boardRouter.use(authenticate)
boardRouter.get('/', list)
boardRouter.get('/:id', getById)
boardRouter.post('/', create)
boardRouter.put('/:id', update)
boardRouter.delete('/:id', remove)
