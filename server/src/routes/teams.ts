import { Router } from 'express'
import { list, create, update, remove, addMember, removeMember } from '../controllers/team-controller'
import { authenticate } from '../middleware/auth'

export const teamRouter = Router()

teamRouter.use(authenticate)
teamRouter.get('/', list)
teamRouter.post('/', create)
teamRouter.put('/:id', update)
teamRouter.delete('/:id', remove)
teamRouter.post('/:id/members', addMember)
teamRouter.delete('/:id/members/:memberId', removeMember)
