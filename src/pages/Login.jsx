import React, { useState } from 'react'
import {useAuth } from '../auth/AuthProvider'
import {Navigate, useNavigate, Link } from 'react-router'
import './Login.css'

export default function Login() {
  const {login,user,loading} = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  async function submit (event) {
    event.preventDefault()
    setError('')
    try { await login(event.target.email.value, 
      event.target.password.value)
      navigate('/', {replace: true})
    } catch (error){
      setError(error.message)
    }
  }
  if (loading) {
    return <p>Tarkistetaan kirjautumista…</p>
}

if (user) {
    return <Navigate to="/" replace />
}
  return (
    <section className='login-page'>
      <h1>Kirjaudu</h1>
      <form onSubmit={submit}>
        <label>
          Sähköposti
          <input
          name='email'
          type='email'
          maxLength={100}
          required>
          </input>
        </label>
        <label>
          Salasana
          <input
          name='password'
          type='password'
          required>
          </input>
        </label>
        <button>Kirjaudu</button>
      </form>

      {error && <p role="alert">{error}</p>}

      <p>
        Ei vielä tiliä? {' '}
        <Link to="/register">Rekisteröidy</Link>
      </p>
    </section>
  )
}
