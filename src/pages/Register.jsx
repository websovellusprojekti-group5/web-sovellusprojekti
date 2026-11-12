import { useState } from 'react'
import { api } from '../api'
import { Link } from 'react-router'
import './Register.css'

export default function Register() {
    const [error, setError] = useState('')
    const [notice, setNotice] = useState('')
    const [loading, setLoading] = useState(false)

    async function submit(event) {
        event.preventDefault()
        const form = event.currentTarget
        setError('')
        setNotice('')
        setLoading(true)

        try {
            await api('/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    username: event.target.username.value,
                    email: event.target.email.value,
                    password: event.target.password.value
                })
            })
            form.reset()
            setNotice('Tili luotu. Siirry kirjautumaan.');
        } catch (error) {
            if (error.status === 400 || error.status === 409) {
                setError(error.message)
            } else {
                setError('Rekisteröityminen epäonnistui. Yritä myöhemmin uudelleen.')
                console.error('Rekisteröintivirhe:', error)
            }
        } finally {
            setLoading(false)
        }
        
    }

    return (
        <section className='register-page'>
            <h1>Rekisteröidy</h1>
            <form onSubmit={submit}>
                <label>Käyttäjänimi<input
                    name='username'
                    type='text'
                    minLength={3}
                    maxLength={50}
                    required
                />
                </label>
                <label>Sähköposti<input
                    name='email'
                    type='email'
                    maxLength={100}
                    required
                />
                </label>
                <label>Salasana<input
                    name='password'
                    type='password'
                    minLength={8}
                    maxLength={64}
                    aria-describedby='password-help'
                    required
                />
                    <p id="password-help">
                        8-64 merkkiä, vähintään yksi iso kirjain,
                        numero ja erikoismerkki.
                    </p>
                </label>
                <button type="submit" disabled={loading}>
                    {loading ? 'Luodaan tiliä...' : 'Luo tili'}</button>
            </form>
            {error && <p role="alert">{error}</p>}
            {notice && (
                <p role="status">
                    {notice}{' '}
                    <Link to="/login">Kirjaudu</Link>
                </p>
            )}
        </section>
    )
}
