import express from 'express'
import { requireAuth } from '../middleware/requireAuth.js'
import { createReview, findMovieReviews } from '../models/Review.js'

const router = express.Router()

router.param('movieId', (req, res, next, value) => {
  const id = Number(value)
  if (!/^\d+$/.test(value) || !Number.isInteger(id) || id < 1 || id > 2147483647) {
    return res.status(400).json({ message: 'Virheellinen elokuvan tunnus.' })
  }
  req.movieId = id
  next()
})

router.get('/:movieId/reviews', async (req, res, next) => {
  try {
    res.json({ reviews: await findMovieReviews(req.movieId) })
  } catch (error) {
    next(error)
  }
})

router.post('/:movieId/reviews', requireAuth, async (req, res, next) => {
  const { rating, comment = '' } = req.body ?? {}
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Valitse tähtiarvio väliltä 1–5.' })
  }
  if (typeof comment !== 'string' || [...comment].length > 2000) {
    return res.status(400).json({ message: 'Arvostelutekstin enimmäispituus on 2000 merkkiä.' })
  }
  try {
    if (!process.env.TMDB_API_KEY) {
      return res.status(500).json({ message: 'TMDB API key is not configured' })
    }
    const url = new URL(`https://api.themoviedb.org/3/movie/${req.movieId}`)
    url.searchParams.set('api_key', process.env.TMDB_API_KEY)
    url.searchParams.set('language', 'fi-FI')
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) })
    if (!response.ok) {
      return res.status(response.status === 404 ? 404 : 502).json({
        message: response.status === 404 ? 'Elokuvaa ei löytynyt.' : 'Elokuvan tietojen hakeminen epäonnistui.'
      })
    }
    const movie = await response.json()
    if (movie.id !== req.movieId || typeof movie.title !== 'string' || !movie.title.trim()) {
      return res.status(502).json({ message: 'Elokuvan tiedot ovat virheelliset.' })
    }
    if (movie.title.length > 100 || (movie.poster_path?.length ?? 0) > 200) {
      return res.status(422).json({ message: 'Elokuvan tiedot ylittävät tietokannan kenttien enimmäispituuden.' })
    }
    const review = await createReview(req.user.id, movie, rating, comment.trim())
    res.status(201).json({ review: { ...review, username: req.user.username } })
  } catch (error) {
    next(error)
  }
})

export default router
