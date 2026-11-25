import { canViewProfile } from "../models/ProfileAccess.js";

export async function requireProfileAccess(req, res, next) {
    const profileId = Number(req.params.userId)

    if (!Number.isSafeInteger(profileId) || profileId <= 0 ||
        profileId > 2147483647) {
        return res.status(400).json({
            message: 'Virheellinen käyttäjätunniste'
        })
    }

    try {
        const allowed = await canViewProfile(
            req.user.id,
            profileId
        )
        if (!allowed) {
            return res.status(403).json({
                message: 'Ei oikeutta tämän profiilin katseluun.'
            })
        }

        next()
    } catch (error) {
        next(error)
    }
}