import { useEffect, useState } from "react"
import axios from "axios"
import Moviecard from "../components/Moviecard/Moviecard"

export default function Home() {
     const [movies, setMovies] = useState([])
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState('')

     useEffect(() => {
          const controller = new AbortController()

          async function fetchTrending() {
               try {
                    const { data } = await axios.get('/api/tmdb/trending', {
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
          fetchTrending()
          return () => controller.abort()
     }, [])
     return (
          <section>
               <h1>Viikon trendaavat elokuvat</h1>
               {loading && <p role="status">Ladataan elokuvia…</p>}
               {error && <p role="alert">{error}</p>}
               {!loading && !error && movies.length === 0 && <p>Elokuva ei löytynyt.</p>}
               <div className="movie-grid">
                    {movies.map((movie) => (
                         <Moviecard key={movie.id} movie={movie} />
                    ))}
               </div>
          </section>
     )
} 
