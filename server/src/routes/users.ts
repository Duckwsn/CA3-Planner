import { Router } from 'express'
import { list } from '../controllers/user-controller'
import { authenticate } from '../middleware/auth'

export const userRouter = Router()

userRouter.use(authenticate)
userRouter.get('/', list)
