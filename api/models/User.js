import { pool } from './db.js'

export const createUser = async (username, email, passwordHash) => {
    const result = await pool.query(
        `INSERT INTO users (username, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, username, email, created_at`,
        [username, email, passwordHash]
    )

    return result.rows[0]
}
export const findUserByEmail = async (email) => {
    const result = await pool.query(
        `SELECT id, username, email, password_hash
        FROM users
        WHERE email = $1`,
        [email]
    )
    return result.rows[0]
}
export const findUserById = async (id) => {
    const result = await pool.query(
        `SELECT id, username, email 
        FROM users 
        WHERE id = $1`,
        [id]
    )
    return result.rows[0]
}