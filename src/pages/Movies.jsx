import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSearchParams } from 'react-router'
import Moviecard from '../components/Moviecard/Moviecard'


export default function Movies() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const sort = searchParams.get('sort') || 'all'
  const [movies, setMovies] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const titles = {
  all: 'Kaikki elokuvat',
  newest: 'Uusimmat elokuvat',
  popular: 'Suosituimmat elokuvat',
  top_rated: 'Parhaiten arvostellut elokuvat',
}

  useEffect(() => {
    const controller = new AbortController()

    async function fetchMovies() {
      setLoading(true)
      setError('')
      try {
        const { data } = await axios.get(`/api/tmdb/dropdown/${sort}`, {
          params: { page },
          signal: controller.signal,
        })
  if (!Array.isArray(data.results)) {
    throw new Error('Invalid movie response')
  }
  setMovies(data.results)
  setTotalPages(Math.min(data.total_pages, 500))
} catch {
  if (!controller.signal.aborted) {
    setError('Elokuvien hakeminen epäonnistui. Yritä myöhemmin uudelleen.')
  }
} finally {
  if (!controller.signal.aborted) setLoading(false)
}
        }

fetchMovies()
return () => controller.abort()
      }, [sort, page])

return (<section aria-label="Elokuvat">
  <h1>{titles[sort] || 'Elokuvat'}</h1>
  {loading && <p role="status">Ladataan elokuvia…</p>}
  {error && <p role="alert">{error}</p>}
  {!loading && !error && movies.length === 0 && <p>Elokuvia ei löytynyt.</p>}

  <button
  disabled={loading || page <= 1}
  onClick={() => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(page - 1))
    setSearchParams(params)
  }}
>
  Edellinen sivu
</button>

  <button
  disabled={loading || page >= totalPages}
  onClick={() => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(page + 1))
    setSearchParams(params)
  }}
>
  Seuraava sivu
</button>

<span className="page-number">
  Sivu {page} / {totalPages}
</span>

  <div className="movie-grid">
  {movies.map((movie) => (
    <Moviecard key={movie.id} movie={movie} />
  ))}
</div>
</section>) 
}