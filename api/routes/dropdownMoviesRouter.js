import express from 'express'

const router = express.Router()

async function fetchMovies(url, page = 1) {
    url.searchParams.set('page', String(page))

    const response = await fetch(url)

    if (!response.ok) {
      const error = new Error("Elokuvien haku epäonnistui")
      error.status = response.status
      throw error
    }
  return response.json()
}

router.get('/all', async (req, res, next) => {
  try {
    if (!process.env.TMDB_API_KEY) {
      return res.status(500).json({ error: 'TMDB API key puuttuu' })
    }

    const url = new URL('https://api.themoviedb.org/3/discover/movie')
    url.searchParams.set('api_key', process.env.TMDB_API_KEY)
    url.searchParams.set('language', 'fi-FI')
    url.searchParams.set('sort_by', 'vote_count.desc')

    res.json(await fetchMovies(url, req.query.page || 1))

  } catch (error) {
    next(error)
  }
})


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

    res.json(await fetchMovies(url, req.query.page || 1))

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

    res.json(await fetchMovies(url, req.query.page || 1))

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

    res.json(await fetchMovies(url, req.query.page || 1))

  } catch (error) {
    next(error)
  }
})

export default router