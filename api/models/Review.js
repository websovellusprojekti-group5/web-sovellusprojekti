import { pool } from './db.js'

export async function findMovieReviews(movieId) {
  const result = await pool.query(
    `SELECT reviews.id, reviews.rating, reviews.comment, reviews.created_at,
            users.username
     FROM reviews JOIN users ON users.id = reviews.user_id
     JOIN movies ON movies.id = reviews.movie_id
     WHERE movies.tmdb_id = $1
     ORDER BY reviews.created_at DESC, reviews.id DESC`,
    [movieId]
  )
  return result.rows
}

export async function createReview(userId, movie, rating, comment) {
  const result = await pool.query(
    `WITH saved_movie AS (
       INSERT INTO movies (tmdb_id, title, overview, release_date, poster_path)
       VALUES ($2, $5, $6, $7, $8)
       ON CONFLICT (tmdb_id) DO UPDATE SET title = EXCLUDED.title
       RETURNING id
     )
     INSERT INTO reviews (user_id, movie_id, rating, comment)
     SELECT $1, saved_movie.id, $3, $4 FROM saved_movie
     RETURNING id, rating, comment, created_at`,
    [userId, movie.id, rating, comment, movie.title,
      movie.overview || null, movie.release_date || null, movie.poster_path || null]
  )
  return result.rows[0]
}
