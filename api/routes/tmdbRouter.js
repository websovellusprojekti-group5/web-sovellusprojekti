import express from 'express'
import tmdbSearchRouter from './tmdbSearchRouter.js'

const router = express.Router()

async function fetchTmdb(path, params = {}) {
  if (!process.env.TMDB_API_KEY) {
    const error = new Error('TMDB API key is not configured')
    error.status = 500
    throw error
  }

  const url = new URL(`https://api.themoviedb.org/3/${path}`)
  url.searchParams.set('api_key', process.env.TMDB_API_KEY)

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  const response = await fetch(url)

  if (!response.ok) {
    const error = new Error('TMDB API request failed')
    error.status = response.status
    throw error
  }

  return response.json()
}

// Search movies using TMDB
router.get('/search', async (req, res, next) => {
  try {
    const { query } = req.query

    if (typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({
        error: 'Search query is required'
      })
    }

    const data = await fetchTmdb('search/movie', {
      query: query.trim()
    })

    res.json(data)
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message })
    }
    next(error)
  }
})
router.use('/search', tmdbSearchRouter)

router.get('/trending/', async (req, res, next) => {
  try {
    const data = await fetchTmdb('trending/movie/week', {
      language: 'fi-FI'
    })

    res.json(data)
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message })
    }
    next(error)
  }
})


router.get('/popular/', async (req, res, next) => {
  try {
    const data = await fetchTmdb('movie/popular', {
      language: 'fi-FI'
    })

    res.json(data)
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message })
    }
    next(error)
  }
})

router.get('/top-rated/', async (req, res, next)=>{
  try {
    const data = await fetchTmdb('movie/top_rated', {
      language: 'fi-FI'
    })

    res.json(data)
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message })
    }
    next(error)
  }
})

export default router
