import { pool } from './db.js'

export async function canViewProfile(viewerId, profileId) {
    if (String(viewerId) === String(profileId)) {
        return true
    }
    const result = await pool.query(`
        SELECT EXISTS(
        SELECT 1
        FROM group_members AS viewer
        JOIN group_members AS target
            ON viewer.group_id = target.group_id
        WHERE viewer.user_id = $1
          AND target.user_id = $2
          AND viewer.request_status = 'accepted'
          AND target.request_status = 'accepted'
        ) AS allowed `,
        [viewerId, profileId]
    )
    return result.rows[0].allowed
}