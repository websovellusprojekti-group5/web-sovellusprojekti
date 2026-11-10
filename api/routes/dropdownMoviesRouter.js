import express from 'express'

const router = express.Router()

router.get('/newest', async (req, res, next) => {
  try {
    if (!process.env.TMDB_API_KEY) {
      return res.status(500).json({
        error: 'TMDB API key is not configured'
      })
    }

    const url = new URL(
      'https://api.themoviedb.org/3/discover/movie'
    )

    const today = new Date().toISOString().slice(0, 10)

    url.searchParams.set('api_key', process.env.TMDB_API_KEY)
    url.searchParams.set('language', 'fi-FI')
    url.searchParams.set('sort_by', 'primary_release_date.desc')
    url.searchParams.set('primary_release_date.lte', today)

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


router.get('/popular', async (req, res, next) => {
  try {
    if (!process.env.TMDB_API_KEY) {
      return res.status(500).json({
        error: 'TMDB API key is not configured'
      })
    }

    const url = new URL(
      "https://api.themoviedb.org/3/movie/popular"
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

router.get('/top_rated', async (req, res, next) => {
  try {
    if (!process.env.TMDB_API_KEY) {
      return res.status(500).json({
        error: 'TMDB API key is not configured'
      })
    }

    const url = new URL(
      "https://api.themoviedb.org/3/movie/top_rated"
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