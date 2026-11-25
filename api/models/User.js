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
export const findProfileById = async (id) => {
    const result = await pool.query(
        `SELECT id, username
        FROM users
        WHERE id = $1`,
        [id]
    )
    return result.rows[0]
}
export const findReviewsByUserId = async (userId) => {
    const result = await pool.query(
        `SELECT
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        m.id AS movie_id,
        m.tmdb_id,
        m.title,
        m.poster_path
        FROM reviews AS r
        JOIN movies AS m ON m.id = r.movie_id
        WHERE r.user_id = $1
        ORDER BY r.created_at DESC, r.id DESC`,
        [userId]
    )
    return result.rows
}
export const findListsByUserId = async(userId) => {
    const result = await pool.query(
        `SELECT id, name
        FROM lists
        WHERE user_id = $1
        ORDER BY id DESC`,
        [userId]
    )
    return result.rows
}