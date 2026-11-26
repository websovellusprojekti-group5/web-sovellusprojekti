import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { api } from '../api'
import './Profile.css'

export default function ProfileReviews() {
    const { userId } = useParams()
    const { user, loading: authLoading } = useAuth()

    const [profile, setProfile] = useState(null)
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const targetUserId = userId ?? user?.id

    useEffect(() => {
        if (authLoading || !user || !targetUserId) return

        const controller = new AbortController()

        async function loadReviews() {
            setLoading(true)
            setError('')

            try {
                const data = await api(`/users/${targetUserId}/reviews`, {
                    signal: controller.signal,
                })
                if (controller.signal.aborted) return
                setProfile(data.profile)
                setReviews(data.reviews)
            } catch (error) {
                if (controller.signal.aborted) return

                setError(
                    error.status === 403
                        ? 'Ei oikeutta tämän käyttäjän arvostelujen katseluun.'
                        : error.status === 401
                            ? 'Kirjaudu sisään nähdäksesi arvostelut.'
                            : error.message
                )
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false)
                }
            }
        }
        loadReviews()

        return () => controller.abort()
    }, [authLoading, user, targetUserId])

    if (authLoading) return <p>Ladataan...</p>
    if (!user) return <p>Kirjaudu sisään nähdäksesi arvostelut.</p>
    if (loading) return <p>Ladataan arvosteluja...</p>
    if (error) return <p role="alert">{error}</p>
    if (!profile) return <p>Profiilia ei löytynyt.</p>

    return (
        <div className="profile-page">
            <section>
                <h1>Käyttäjän {profile.username} arvostelut</h1>

                {reviews.length === 0 ? (
                    <p>Ei vielä arvosteluja.</p>
                ) : (
                    reviews.map(review => (
                        <article key={review.id}>
                            <h2>{review.title}</h2>
                            <p>Arvosana: {review.rating} / 5</p>
                            {review.comment && <p>{review.comment}</p>}
                            <time dateTime={review.created_at}>
                                {new Date(review.created_at).toLocaleString('fi-FI')}
                            </time>
                        </article>
                    ))
                )}
            </section>
        </div>
    )
}
