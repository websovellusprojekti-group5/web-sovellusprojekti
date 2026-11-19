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
    }   catch (error) {
        await client.query('ROLLBACK')
        throw error
    }   finally {
        client.release()
    }
}