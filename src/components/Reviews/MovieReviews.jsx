import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { api } from '../../api'
import { useAuth } from '../../auth/AuthProvider'
import './MovieReviews.css'

export default function MovieReviews({ movieId }) {
  const { user, loading: authLoading } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    api(`/movies/${movieId}/reviews`, { signal: controller.signal })
      .then(data => {
        if (!controller.signal.aborted) setReviews(data.reviews)
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoadError('Arvostelujen hakeminen epäonnistui.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [movieId])

  async function handleSubmit(event) {
    event.preventDefault()
    if (saving) return
    setError('')
    setSuccess('')
    if (!rating) {
      setError('Valitse tähtiarvio ennen lähettämistä.')
      return
    }
    setSaving(true)
    try {
      const data = await api(`/movies/${movieId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({ rating, comment }),
      })
      setReviews(previous => [data.review, ...previous])
      setRating(0)
      setComment('')
      setSuccess('Arvostelu tallennettiin.')
    } catch (error) {
      setError(error.status === 401
        ? 'Kirjaudu sisään lähettääksesi arvostelun.'
        : error.status === 400 ? error.message : 'Arvostelun tallentaminen epäonnistui. Yritä uudelleen.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="movie-reviews" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading">Arvostelut</h2>
      {authLoading ? <p role="status">Tarkistetaan kirjautumista…</p> : user ? (
        <form className="review-form" onSubmit={handleSubmit}>
          <h3>Kirjoita arvostelu</h3>
          <fieldset disabled={saving || loading}>
            <legend>Tähtiarvio (pakollinen)</legend>
            <div className="review-stars">
              {[1, 2, 3, 4, 5].map(value => (
                <label key={value} className="review-star">
                  <input
                    type="radio" name="rating" value={value} required
                    checked={rating === value}
                    onChange={() => { setRating(value); setSuccess('') }}
                  />
                  <span className={value <= rating ? 'is-selected' : ''} aria-hidden="true">★</span>
                  <span className="review-sr-only">{value} / 5 tähteä</span>
                </label>
              ))}
            </div>
            <p className="review-rating-text">{rating ? `${rating} / 5 tähteä` : 'Valitse 1–5 tähteä'}</p>
            <label htmlFor="review-comment">Arvosteluteksti (vapaaehtoinen)</label>
            <textarea
              id="review-comment" rows={5} maxLength={2000}
              value={comment} aria-describedby="review-length"
              onChange={event => { setComment(event.target.value); setSuccess('') }}
            />
            <p id="review-length">{comment.length} / 2000 merkkiä</p>
            <button type="submit">{saving ? 'Tallennetaan…' : 'Lähetä arvostelu'}</button>
          </fieldset>
          {error && <p role="alert">{error}</p>}
          {success && <p role="status">{success}</p>}
        </form>
      ) : <p><Link to="/login">Kirjaudu sisään</Link> kirjoittaaksesi arvostelun.</p>}

      {loading && <p role="status">Ladataan arvosteluja…</p>}
      {loadError && <p role="alert">{loadError}</p>}
      {!loading && !loadError && reviews.length === 0 && <p>Ei vielä arvosteluja.</p>}
      <ul className="review-list">
        {reviews.map(review => (
          <li key={review.id}>
            <article>
              <h3>{review.username}</h3>
              <p>
                <span className="review-display-stars" aria-hidden="true">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </span>
                <span className="review-sr-only">{review.rating} / 5 tähteä</span>
              </p>
              <time dateTime={review.created_at}>
                {new Date(review.created_at).toLocaleString('fi-FI')}
              </time>
              {review.comment && <p className="review-comment">{review.comment}</p>}
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
