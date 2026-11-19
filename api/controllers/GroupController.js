import { createGroup, getPublicGroups, getOneGroup, updateGroup, deleteGroup } from '../models/Group.js'

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
    } catch (error) {
        next(error)
    }
}

export const getGroups = async (req, res, next) => {
    try {
        const groups = await getPublicGroups()

        return res.status(200).json({ groups })
    } catch (error) {
        next(error)
    }
}

export const getGroup = async (req, res, next) => {
    try {
        const { id } = req.params
        const groupId = Number(id)

        if (
            !/^[1-9]\d*$/.test(id) ||
            !Number.isSafeInteger(groupId) ||
            groupId > 2147483647
        ) {
            return res.status(400).json({
                message: 'Invalid group ID'
            })
        }

        const group = await getOneGroup(groupId, req.user.id)
        if (!group) {
            return res.status(404).json({
                message: 'Group not found'
            })
        }

        return res.status(200).json({ group })
    } catch (error) {
        next(error)
    }
}

export const patchGroup = async (req, res, next) => {
    try {
        const { id } = req.params
        const groupId = Number(id)

        if (
            !/^[1-9]\d*$/.test(id) ||
            !Number.isSafeInteger(groupId) ||
            groupId > 2147483647
        ) {
            return res.status(400).json({
                message: 'Invalid group ID'
            })
        }

        const { name, description, is_public } = req.body ?? {}

        if (
            name === undefined &&
            description === undefined &&
            is_public === undefined
        ) {
            return res.status(400).json({
                message: 'Provide name, description or privacy status'
            })
        }

        if (
            name !== undefined && (
                typeof name !== 'string' ||
                !name.trim() ||
                name.trim().length > 50
            )
        ) {
            return res.status(400).json({
                message: 'Group name must be between 1 and 50 characters'
            })
        }

        if (
            description !== undefined &&
            typeof description !== 'string'
        ) {
            return res.status(400).json({
                message: 'Description must be a string'
            })
        }

        if (
            is_public !== undefined &&
            typeof is_public !== 'boolean'
        ) {
            return res.status(400).json({
                message: 'is_public must be boolean'
            })
        }

        const group = await updateGroup({
            groupId,
            userId: req.user.id,
            name: name?.trim(),
            description: description?.trim(),
            isPublic: is_public
        })

        if (!group) {
            return res.status(404).json({
                message: 'Group not found'
            })
        }

        return res.status(200).json({ group })
    } catch (error) {
        next(error)
    }
}

export const removeGroup = async (req, res, next) => {
    try {
        const { id } = req.params
        const groupId = Number(id)

        if (
            !/^[1-9]\d*$/.test(id) ||
            !Number.isSafeInteger(groupId) ||
            groupId > 2147483647
        ) {
            return res.status(400).json({
                message: 'Invalid group ID'
            })
        }

        const group = await deleteGroup(groupId, req.user.id)

        if (!group) {
            return res.status(404).json({
                message: 'Group not found or you cannot delete it'
            })
        }

        return res.status(204).end()
    } catch (error) {
        next(error)
    }
}