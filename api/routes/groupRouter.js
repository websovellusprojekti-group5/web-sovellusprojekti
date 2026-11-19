import express from 'express'
import { postGroup } from '../controllers/GroupController.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

router.post('/', requireAuth, postGroup)

export default router