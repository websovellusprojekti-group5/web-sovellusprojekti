import { createGroup } from '../models/Group.js'

export const postGroup = async (req, res, next) => {
    try {
        const {
            name,
            description = '',
            is_public = false
        } = req.body ?? {}

        if (typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({
                message: 'Group name is required'
            })
        }

        if (name.trim().length > 50) {
            return res.status(400).json({
                message: 'Group name must be at most 50 characters'
            })
        }

        if (typeof description !== 'string') {
            return res.status(400).json({
             message: 'Description must be a string'
            })
        }

        if (typeof is_public !== 'boolean') {
            return res.status(400).json({
             message: 'is_public must be boolean'
            })
        }

        const group = await createGroup({
            name: name.trim(),
            description: description.trim(),
            isPublic: is_public,
            userId: req.user.id
        })

        return res.status(201).json({ group })
    }   catch (error) {
        next(error)
    }
}
