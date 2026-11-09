import { useEffect, useState } from 'react'
import axios from 'axios'
import Moviecard from '../components/Moviecard/Moviecard'


export default function Movies () {
    const [movies, setMovies] = useState([])
      const [loading, setLoading] = useState(true)
      const [error, setError] = useState('')
    
      useEffect(() => {
        const controller = new AbortController()
    
        async function fetchMovies() {
          try {
            const { data } = await axios.get('/api/tmdb/search', {
              params: { query: 'Batman' },
              signal: controller.signal,
            })
            if (!Array.isArray(data.results)) {
              throw new Error('Invalid movie response')
            }
            setMovies(data.results)
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
      }, [])
    
return (<section aria-label="Elokuvat">
        {loading && <p role="status">Ladataan elokuvia…</p>}
        {error && <p role="alert">{error}</p>}
        {!loading && !error && movies.length === 0 && <p>Elokuvia ei löytynyt.</p>}
        {movies.map((movie) => (
          <Moviecard key={movie.id} movie={movie} />
        ))}
      </section>) 
}