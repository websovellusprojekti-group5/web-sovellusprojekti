import express from 'express'
import {requireAuth} from '../middleware/requireAuth.js'
import {requireProfileAccess} from '../middleware/requireProfileAccess.js'
import {
    getProfile,
    getUserLists,
    getUserReviews
} from '../controllers/UserController.js'

const router = express.Router()

router.get('/:userId', requireAuth, requireProfileAccess, getProfile)

router.get(
    '/:userId/lists',
    requireAuth,
    requireProfileAccess,
    getUserLists
)

router.get(
    '/:userId/reviews',
    requireAuth,
    requireProfileAccess,
    getUserReviews
)
export default router