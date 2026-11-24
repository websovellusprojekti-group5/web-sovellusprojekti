import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../auth/AuthProvider'
import { api } from '../api'
import './CreateGroup.css'

export default function CreateGroup() {

    const { user, loading } = useAuth()
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [notice, setNotice] = useState('')

    async function handleSubmit(event) {
        event.preventDefault()
        if (submitting) return

        const form = event.currentTarget
        const formData = new FormData(form)
        const name = String(formData.get('name') ?? '').trim()

        setError('')
        setNotice('')

        if (!name || name.length > 50) {
            setError('Ryhmän nimen tulee olla 1-50 merkkiä.')
            return
        }

        setSubmitting(true)

        try {
            const { group } = await api('/groups', {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    description: String(
                        formData.get('description') ?? ''
                    ).trim(),
                    is_public: formData.has('is_public')
                })
            })

            form.reset()
            setNotice(`Ryhmä "${group.name}" luotu.`)
        } catch (error) {
            if (error.status === 401) {
                setError('Istunto vanhentunut. Kirjaudu uudelleen.')
            } else if (error.status === 400) {
                setError(error.message)
            } else {
                setError('Ryhmän luominen epäonnistui. Yritä uudelleen')
            }
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return <p role="status">Tarkastetaan kirjautumista...</p>
    }

    if (!user) {
        return (
            <section className="create-group-page">
                <h1>Luo ryhmä</h1>
                <p>Kirjaudu sisään luodaksesi ryhmän.</p>
                <Link to="/login">Kirjaudu</Link>
            </section>
        )
    }
    return (
        <section className='create-group-page'>
            <h1>Luo ryhmä</h1>

            <form onSubmit={handleSubmit}>
                <label>
                    Ryhmän nimi
                    <input
                        name="name"
                        type="text"
                        maxLength={50}
                        required
                        disabled={submitting} />
                </label>

                <label>
                    Kuvaus
                    <textarea
                        name="description"
                        rows={4}
                        disabled={submitting} />
                </label>

                <label className="visibility-option">
                    <input
                        name="is_public"
                        type="checkbox"
                        disabled={submitting} />

                    Julkinen ryhmä
                </label>

                <p>
                    Julkinen ryhmä näkyy kirjautuneille käyttäjille.
                    Yksityinen rymä näkyy vain hyväksytyille jäsenille.
                </p>

                <button type="submit" disabled={submitting}>
                    {submitting ? 'Luodaan ryhmää...' : 'Luo ryhmä'}
                </button>
            </form>
            {error && <p role="alert">{error}</p>}
            {notice && <p role="status">{notice}</p>}

        </section>
    )
}
