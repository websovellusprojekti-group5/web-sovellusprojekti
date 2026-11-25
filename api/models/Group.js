import { pool } from './db.js'

export const createGroup = async ({
    name,
    description,
    isPublic,
    userId
}) => {
    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        const result = await client.query(
            `INSERT INTO groups (name, description, is_public)
            VALUES ($1,$2,$3)
            RETURNING id, name, description, is_public, created_at`,
            [name, description, isPublic]
        )

        const group = result.rows[0]

        await client.query(
            `INSERT INTO group_members (group_id, user_id, role, request_status)
            VALUES ($1, $2, $3, $4)`,
            [group.id, userId, 'owner', 'accepted']
        )

        await client.query('COMMIT')

        return group
    } catch (error) {
        await client.query('ROLLBACK')
        throw error
    } finally {
        client.release()
    }
}

export const getPublicGroups = async () => {
    const result = await pool.query(
        `SELECT id, name, description, is_public, created_at
        FROM groups WHERE is_public = true
        ORDER BY created_at DESC, id DESC`
    )

    return result.rows
}

export const getOneGroup = async (groupId, userId) => {
    const result = await pool.query(
        `SELECT g.id, g.name, g.description, g.is_public, g.created_at
        FROM groups g WHERE g.id = $1
        AND (g.is_public = true
        OR EXISTS (
        SELECT 1 from group_members gm
         WHERE gm.group_id = g.id
         AND gm.user_id = $2
         AND gm.request_status = 'accepted'
         )
        )`,
        [groupId, userId]
    )

    return result.rows[0]
}

export const updateGroup = async ({
    groupId,
    userId,
    name,
    description,
    isPublic
}) => {
    const result = await pool.query(
        `UPDATE groups g 
            SET name =  COALESCE($3, g.name),
                description = COALESCE($4, g.description),
                is_public = COALESCE($5, g.is_public)
            WHERE g.id = $1
                AND EXISTS (
                    SELECT 1
                    FROM group_members gm
                    WHERE gm.group_id = g.id
                        AND gm.user_id = $2
                        AND gm.role = 'owner'
                        AND gm.request_status = 'accepted'
            )
        RETURNING g.id, g.name, g.description, g.is_public, g.created_at`,
        [
            groupId,
            userId,
            name ?? null,
            description ?? null,
            isPublic ?? null
        ]
    )

    return result.rows[0]
}

export const deleteGroup = async (groupId, userId) => {
    const result = await pool.query(
        `DELETE FROM groups g
        WHERE g.id = $1
        AND EXISTS (
            SELECT 1
            FROM group_members gm
            WHERE gm.group_id = g.id
                AND gm.user_id = $2
                AND gm.role = 'owner'
                AND gm.request_status = 'accepted'
    )
    RETURNING g.id`,[groupId, userId]
    )
    return result.rows[0]
}