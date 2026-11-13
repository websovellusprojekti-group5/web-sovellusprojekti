import { Link } from 'react-router'
import './Moviecard.css'

export default function Moviecard({ movie }) {
    return (
        <Link className="movie-card-link" to={`/movies/${movie.id}`}>
            <article className="movie-card">
                {movie.poster_path ? (
                    <img
                        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                        alt={movie.title}
                        loading="lazy"
                        width="342"
                        height="513"
                    />
                ) : (
                    <p>Ei julistekuvaa</p>
                )}
                <h2>{movie.title}</h2>
                <p>{movie.release_date?.slice(0, 4) || 'Julkaisuvuosi ei tiedossa'}</p>
            </article>
        </Link>
    )
}

/*import './Moviecard.css'

export default function Moviecard({movie}) {
    return (
        <div>
            <article className="movie-card">
                {movie.poster_path ? (
                    <img
                        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                        alt={movie.title}
                        loading="lazy"
                        width="342"
                        height="513"
                    />
                ) : (
                    <p>Ei julistekuvaa</p>
                )}
                <h2>{movie.title}</h2>
                <p>{movie.release_date?.slice(0, 4) || 'Julkaisuvuosi ei tiedossa'}</p>
            </article>
        </div>
    )
}
*/