import express from 'express'
import tmdbSearchRouter from './tmdbSearchRouter.js'

const router = express.Router()

router.use('/search', tmdbSearchRouter)

router.get('/trending/', async (req, res, next) => {
  try {
    if (!process.env.TMDB_API_KEY) {
      return res.status(500).json({
        error: 'TMDB API key is not configured'
      })
    }
    const url = new URL(
      "https://api.themoviedb.org/3/trending/movie/week"
    )

    url.searchParams.set('api_key', process.env.TMDB_API_KEY)
    url.searchParams.set('language', 'fi-FI')

    const response = await fetch(url)

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'TMDB API request failed'
      })
    }

    const data = await response.json()

    res.json(data)
  } catch (error) {
    next(error)
  }
})
export default router