import express from 'express'
import { register, login, logout } from '../controllers/AuthController.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', requireAuth,(req,res) => {
    return res.status(200).json({
        user: req.user
    })
})
router.post('/logout', logout)
export default router
