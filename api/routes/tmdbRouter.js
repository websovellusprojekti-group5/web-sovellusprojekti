import express from 'express'
import tmdbSearchRouter from './tmdbSearchRouter.js'
import dropdownMoviesRouter from './dropdownMoviesRouter.js'
import movieRouter from './movieRouter.js'

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

router.use('/search', tmdbSearchRouter)
router.use('/dropdown', dropdownMoviesRouter)
router.use('/', movieRouter)
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