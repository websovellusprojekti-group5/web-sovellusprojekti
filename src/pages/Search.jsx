import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import axios from 'axios'
import Moviecard from '../components/Moviecard/Moviecard'

export default function Search() {
  const [searchParams] = useSearchParams()
  const query = (searchParams.get('query') || '').trim()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!query) {
      setMovies([])
      setError('')
      setLoading(false)
      return
    }

    const controller = new AbortController()

    async function fetchMovies() {
      setLoading(true)
      setError('')

      try {
        const { data } = await axios.get('/api/tmdb/search', {
          params: { query },
          signal: controller.signal,
        })
        if (!Array.isArray(data.results)) {
          throw new Error('Invalid movie response')
        }
        setMovies(data.results)
      } catch {
        if (!controller.signal.aborted) {
          setMovies([])
          setError('Elokuvien hakeminen epäonnistui. Yritä myöhemmin uudelleen.')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchMovies()
    return () => controller.abort()
  }, [query])

  return (
    <section aria-label="Elokuvahaku">
      <h1>Elokuvahaku</h1>
      {query && <h2>Hakutulokset: {query}</h2>}
      {!query && <p>Kirjoita elokuvan nimi hakukenttään.</p>}
      {loading && <p role="status">Ladataan elokuvia…</p>}
      {error && <p role="alert">{error}</p>}
      {query && !loading && !error && movies.length === 0 && <p>Elokuvia ei löytynyt.</p>}
      <div className="movie-grid">
        {movies.map((movie) => (
          <Moviecard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  )
}
