import express from 'express'
import { postGroup, getGroups, getGroup, patchGroup, removeGroup, getMyGroups } from '../controllers/GroupController.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

router.get('/', requireAuth, getGroups)
router.get('/mine', requireAuth, getMyGroups)
router.get('/:id', requireAuth, getGroup)
router.post('/', requireAuth, postGroup)
router.patch('/:id', requireAuth, patchGroup)
router.delete('/:id', requireAuth, removeGroup)

export default router