import express from 'express'

const router = express.Router()

router.get('/movie/:id', async (req, res, next) => {
  try {
    if (!/^\d+$/.test(req.params.id)) {
      return res.status(400).json({
        error: 'Invalid movie ID'
      })
    }

    if (!process.env.TMDB_API_KEY) {
      return res.status(500).json({
        error: 'TMDB API key is not configured'
      })
    }

    const url = new URL(
      `https://api.themoviedb.org/3/movie/${req.params.id}`
    )

    url.searchParams.set('api_key', process.env.TMDB_API_KEY)
    url.searchParams.set('language', 'fi-FI')
    url.searchParams.set('append_to_response', 'credits')

    const response = await fetch(url)

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'TMDB API request failed'
      })
    }

   const data = await response.json()

// Jos suomenkielinen kuvaus puuttuu, haetaan englanniksi.
if (!data.overview?.trim()) {
  url.searchParams.set('language', 'en-US')

  try {
    const englishResponse = await fetch(url)

    if (englishResponse.ok) {
      const englishData = await englishResponse.json()
      data.overview = englishData.overview
    }
  } catch {
  }
}

  res.json(data)
  } catch (error) {
    next(error)
  }
})

export default router