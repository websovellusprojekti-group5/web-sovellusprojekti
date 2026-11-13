import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import axios from "axios";
import './MovieDetails.css'

export default function MovieDetails() {
    const { id } = useParams()

    const [result, setResult] = useState({
        id: null,
        movie: null,
        error: ''
    })

    useEffect(() => {
        const controller = new AbortController()

        async function fetchMovie() {
            try {
                const { data } = await axios.get(`/api/tmdb/movie/${id}`, {
                    signal: controller.signal,
                })
                
                if (!data.id || !data.title) {
                    throw new Error('Invalid movie response')
                }

                if (!controller.signal.aborted) {
                    setResult({
                        id,
                        movie: data,
                        error: ''
                    })
            }

            } catch (error) {
                if (!controller.signal.aborted) {
                    setResult({
                        id,
                        movie: null,
                        error: error.response?.status === 404
                            ? 'Elokuvaa ei löytynyt.'
                            : 'Elokuvan hakeminen epäonnistui. Yritä myöhemmin uudelleen.'
            })
                }
            }
        }

        fetchMovie()

        return () => controller.abort()
    }, [id])

    const loading = result.id !== id
    const { movie, error } = result

    return (
        <section className="movie-details" aria-label="Elokuvan tiedot">
            <Link to="/">Takaisin etusivulle</Link>

            {loading ? (
                <p role="status">Ladataan elokuvan tietoja…</p>
            ) : error ? (
                <p role="alert">{error}</p>
            ) : movie && (
                <article className="movie-details-content">
                    {movie.poster_path && (
                        <img
                            src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                            alt={movie.title}
                            width="342"
                            height="513"
                        />  
                    )}

                    <div>
                        <h1>{movie.title}</h1>

                        {movie.tagline && (
                            <p><em>{movie.tagline}</em></p>
                        )}

                        <p>
                            {movie.overview ||
                            'Elokuvan kuvaus ei ole saatavilla suomeksi.'}
                        </p>

                        <dl>
                            <dt>Julkaisupäivä</dt>
                            <dd>{movie.release_date || 'Ei tiedossa'}</dd>

                            <dt>Kesto</dt>
                            <dd>
                                {movie.runtime ? `${movie.runtime} minuuttia` : 'Ei tiedossa'}
                            </dd>

                            <dt>Lajityypit</dt>
                            <dd>
                                {movie.genres?.map((genre) => genre.name).join(', ') || 
                                'Ei tiedossa'}
                            </dd>

                            <dt>TMDB-arvosana</dt>
                            <dd>
                                {movie.vote_count > 0
                                ? `${movie.vote_average.toFixed(1)} / 10 (${movie.vote_count} arviota)`
                                : 'Ei arvioita'}
                            </dd>
                        </dl>
                    </div>
                </article>
            )}
        </section>
    )
            }