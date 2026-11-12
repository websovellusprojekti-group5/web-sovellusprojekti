import jwt from 'jsonwebtoken'
import { findUserById } from '../models/User.js'

export const requireAuth = async (req, res, next) => {
    const token = req.cookies?.auth
    if (!token) {
        return res.status(401).json({
            message: 'Kirjautuminen vaaditaan'
        })
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ['HS256'],
            issuer: 'movie-app',
            audience: 'movie-app-web'
        })

        const user = await findUserById(payload.sub)
        
        if (!user) {
            return res.status(401).json({
                message: 'Käyttäjää ei löydy'
            })
        }
        req.user = user
        next()
    } catch {
        return res.status(401).json({
            message: 'Istunto ei ole enää voimassa'})
    }

}
