import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { listByTask, upload, remove } from '../controllers/attachment-controller'
import { authenticate } from '../middleware/auth'

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, '../../uploads'),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${unique}-${file.originalname}`)
  },
})

const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|zip|rar/
    const ext = path.extname(file.originalname).toLowerCase().slice(1)
    if (allowed.test(ext)) {
      cb(null, true)
    } else {
      cb(new Error('Tipo de arquivo não permitido'))
    }
  },
})

export const attachmentRouter = Router()

attachmentRouter.use(authenticate)
attachmentRouter.get('/task/:taskId', listByTask)
attachmentRouter.post('/upload', uploadMiddleware.single('file'), upload)
attachmentRouter.delete('/:id', remove)
