import express from 'express'
import { postGroup, getGroups, getGroup } from '../controllers/GroupController.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

router.get('/', requireAuth, getGroups)
router.get('/:id', requireAuth, getGroup)
router.post('/', requireAuth, postGroup)

export default router