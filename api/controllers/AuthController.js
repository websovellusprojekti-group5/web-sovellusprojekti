import argon2 from 'argon2'
import { createUser, findUserByEmail } from '../models/User.js'
import jwt from 'jsonwebtoken'

const cookieName = 'auth'
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
}

export const register = async (req, res) => {
    const { username, email, password } = req.body ?? {}

    if (
        typeof username !== 'string' ||
        typeof email !== 'string' ||
        typeof password !== 'string'
    ) {
        return res.status(400).json({
            message: 'Käyttäjänimi, sähköposti ja salasana ovat pakollisia'
        })
    }
    const cleanUsername = username.trim().toLowerCase()
    const cleanEmail = email.trim().toLowerCase()

    if (cleanUsername.length < 3 || cleanUsername.length > 50) {
        return res.status(400).json({
            message: 'Käyttäjänimen tulee olla 3-50 merkkiä'
        })
    }
    if (password.length < 8 || password.length > 64) {
        return res.status(400).json({
            message: 'Salasanan tulee olla 8-64 merkkiä'
        })
    }
    if (
        cleanEmail.length > 100 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    ) {
        return res.status(400).json({
            message: 'Anna kelvollinen sähköpostiosoite, enintään 100 merkkiä'
        })
    }
    if (!/\p{Lu}/u.test(password)) {
        return res.status(400).json({
            message: 'Salasanassa pitää olla vähintään yksi iso kirjain'
        })
    }

    if (!/[0-9]/.test(password)) {
        return res.status(400).json({
            message: 'Salasanassa pitää olla vähintään yksi numero'
        })
    }

    if (!/[\p{P}\p{S}]/u.test(password)) {
        return res.status(400).json({
            message: 'Salasanassa pitää olla vähintää yksi erikoismerkki'
        })
    }

    try {
        const passwordHash = await argon2.hash(password, {
            type: argon2.argon2id
        })


        const user = await createUser(
            cleanUsername,
            cleanEmail,
            passwordHash
        )
        return res.status(201).json({
            message: 'Käyttäjä luotu.',
            user
        })
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({
                message: 'Käyttäjänimi tai sähköposti on jo käytössä'
            })
        }
        console.error('Rekisteröintivirhe:', error.code, error.message)
        return res.status(500).json({
            message: 'Rekisteröityminen epäonnistui'
        })
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body ?? {}

    if (
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        !email.trim() ||
        !password
    ) {
        return res.status(400).json({
            message: 'Sähköposti ja salasana ovat pakollisia'
        })
    }

    try {
        const user = await findUserByEmail(email.trim().toLowerCase())

        if (!user) {
            return res.status(401).json({
                message: 'Virheellinen sähköposti tai salasana'
            })
        }

        const passwordMatches = await argon2.verify(
            user.password_hash,
            password
        )

        if (!passwordMatches) {
            return res.status(401).json({
                message: 'Virheellinen sähköposti tai salasana'
            })
        }

        const token = jwt.sign(
            { sub: String(user.id) },
            process.env.JWT_SECRET,
            {
                expiresIn: '30m',
                algorithm: 'HS256',
                issuer: 'movie-app',
                audience: 'movie-app-web'
            }
        )

        res.cookie(cookieName, token, {
            ...cookieOptions,
            maxAge: 30 * 60 * 1000
        })

        return res.status(200).json({
            message: 'Kirjautuminen onnistui',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.error('Kirjautumisvirhe:', error.code)

        return res.status(500).json({
            message: 'Kirjautuminen epäonnistui'
        })
    }
}
export const logout = (req,res) => {
    res.clearCookie(cookieName,cookieOptions)

    return res.status(200).json({
        message: 'Kirjauduttu ulos.'
    })
}
