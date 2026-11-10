import express from 'express'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const { query } = req.query

    if (typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({
        error: 'Search query is required'
      })
    }

    if (!process.env.TMDB_API_KEY) {
      return res.status(500).json({
        error: 'TMDB API key is not configured'
      })
    }

    const movieUrl = new URL('https://api.themoviedb.org/3/search/movie')
    movieUrl.searchParams.set('api_key', process.env.TMDB_API_KEY)
    movieUrl.searchParams.set('query', query.trim())

    const keywordUrl = new URL('https://api.themoviedb.org/3/search/keyword')
    keywordUrl.searchParams.set('api_key', process.env.TMDB_API_KEY)
    keywordUrl.searchParams.set('query', query.trim())

    const [movieResponse, keywordResponse] = await Promise.all([
      fetch(movieUrl),
      fetch(keywordUrl)
    ])

    if (!movieResponse.ok || !keywordResponse.ok) {
      const failedResponse = !movieResponse.ok ? movieResponse : keywordResponse
      return res.status(failedResponse.status).json({
        error: 'TMDB API request failed'
      })
    }

    const [movieData, keywordData] = await Promise.all([
      movieResponse.json(),
      keywordResponse.json()
    ])
    if (!Array.isArray(movieData.results) || !Array.isArray(keywordData.results)) {
      throw new Error('Invalid TMDB search response')
    }

    const keywordIds = keywordData.results
      .map(({ id }) => id)
      .filter(Number.isInteger)

    let keywordMovies = []
    if (keywordIds.length > 0) {
      const discoverUrl = new URL('https://api.themoviedb.org/3/discover/movie')
      discoverUrl.searchParams.set('api_key', process.env.TMDB_API_KEY)
      discoverUrl.searchParams.set('with_keywords', keywordIds.join('|'))
      discoverUrl.searchParams.set('language', 'fi-FI')

      const discoverResponse = await fetch(discoverUrl)
      if (!discoverResponse.ok) {
        return res.status(discoverResponse.status).json({
          error: 'TMDB API request failed'
        })
      }

      const discoverData = await discoverResponse.json()
      if (!Array.isArray(discoverData.results)) {
        throw new Error('Invalid TMDB keyword search response')
      }
      keywordMovies = discoverData.results
    }

    const resultsById = new Map()
    for (const movie of [...movieData.results, ...keywordMovies]) {
      if (movie?.id != null && !resultsById.has(movie.id)) {
        resultsById.set(movie.id, movie)
      }
    }

    res.json({
      page: 1,
      results: [...resultsById.values()],
      total_pages: 1,
      total_results: resultsById.size
    })
  } catch (error) {
    next(error)
  }
})

export default router
