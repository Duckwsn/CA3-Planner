import { Router } from 'express'
import {
  access,
  stats,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
  listOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  listTables,
  listTableRows,
  createTableRow,
  updateTableRow,
  deleteTableRow,
  runSql,
} from '../controllers/admin-controller'
import { authenticate } from '../middleware/auth'
import { requireAdmin } from '../middleware/admin'

export const adminRouter = Router()

adminRouter.get('/access', authenticate, access)

adminRouter.use(authenticate, requireAdmin)

adminRouter.get('/stats', stats)

adminRouter.get('/users', listUsers)
adminRouter.post('/users', createUser)
adminRouter.patch('/users/:id', updateUser)
adminRouter.delete('/users/:id', deleteUser)
adminRouter.post('/users/:id/password', resetPassword)

adminRouter.get('/organizations', listOrganizations)
adminRouter.post('/organizations', createOrganization)
adminRouter.patch('/organizations/:id', updateOrganization)
adminRouter.delete('/organizations/:id', deleteOrganization)

adminRouter.get('/tables', listTables)
adminRouter.get('/tables/:name', listTableRows)
adminRouter.post('/tables/:name', createTableRow)
adminRouter.patch('/tables/:name/:id', updateTableRow)
adminRouter.delete('/tables/:name/:id', deleteTableRow)

adminRouter.post('/sql', runSql)
