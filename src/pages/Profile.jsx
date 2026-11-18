import React from 'react'
import { useAuth } from '../auth/AuthProvider'
import './Profile.css'

export default function Profile() {
    const { user, loading } = useAuth()

    if (loading) return null
    if (!user) return <p>Kirjaudu sisään nähdäksesi profiilisi</p>
    return (
        <div className='profile-page'>
            <header className='profile.header'>
                <h1>{user.username}</h1>
            </header>
                
            <div className='profile actions'>
                <button type="button">Listat</button>
                <button type="button">Arvostelut</button>
            </div>

            <section>
                <h2>Viimeisin arvostelu</h2>
                <article className='profile-review'>
                    <h3>Batman</h3>
                    <p className='profile-rating' aria-label='4 tähteä'>
                        ★★★★☆
                    </p>
                    <p>
                        Upea elokuva! Batman on kova äijä!
                    </p>
                    <small>ESimerkkiarvostelu</small>
                </article>
            </section>
        </div>
    )
}
