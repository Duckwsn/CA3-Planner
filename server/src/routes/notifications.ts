import { Router } from 'express'
import { list, markRead, markAllRead, unreadCount } from '../controllers/notification-controller'
import { authenticate } from '../middleware/auth'

export const notificationRouter = Router()

notificationRouter.use(authenticate)
notificationRouter.get('/', list)
notificationRouter.get('/unread-count', unreadCount)
notificationRouter.patch('/:id/read', markRead)
notificationRouter.post('/read-all', markAllRead)
