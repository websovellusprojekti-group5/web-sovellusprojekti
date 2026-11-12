import express from 'express'
import movieRouter from './movieRouter.js'

const router = express.Router()

router.use(movieRouter)

// Search movies using TMDB
router.get('/search', async (req, res, next) => {
  try {
    const { query } = req.query

    if (!query || !query.trim()) {
      return res.status(400).json({
        error: 'Search query is required'
      })
    }

    const url = new URL(
      'https://api.themoviedb.org/3/search/movie'
    )

    url.searchParams.set('api_key', process.env.TMDB_API_KEY)
    url.searchParams.set('query', query)

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

router.get('/trending/', async (req, res, next) => {
  try {
    if (!process.env.TMDB_API_KEY) {
      return res.status(500).json({
        error: 'TMDB API key is not configured'
      })
    }

    const url = new URL('https://api.themoviedb.org/3/trending/movie/week')
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
    if (error.status) {
      return res.status(error.status).json({ error: error.message })
    }
    next(error)
  }
})

export default router
