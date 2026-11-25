import { findProfileById, findListsByUserId, findReviewsByUserId } from "../models/User.js";

export const getProfile = async (req, res, next) => {
    try {
        const profile = await findProfileById(req.params.userId)

        if (!profile) {
            return res.status(404).json({
                message: 'Käyttäjää ei löytynyt.'
            })
        }
        return res.status(200).json({ profile })
    } catch (error) {
        next(error)
    }
}

export const getUserLists = async (req, res, next) => {
    try {
        const profile = await findProfileById(req.params.userId)

        if (!profile) {
            return res.status(404).json({
                message: 'Käyttäjää ei löytynyt'
            })
        }
        const lists = await findListsByUserId(profile.id)

        return res.status(200).json({
            profile,
            lists
        })
    } catch (error) {
        next(error)
    }
}
export const getUserReviews = async (req, res, next) => {
    try {
        const profile = await findProfileById(req.params.userId)

        if (!profile) {
            return res.status(404).json({
                message: 'käyttäjää ei löytynyt'
            })
        }
        const reviews = await findReviewsByUserId(profile.id)

        return res.status(200).json({
            profile,
            reviews
        })
    } catch (error) {
        next(error)
    }
}