import { useState } from "react";
import { useAuth } from '../../auth/AuthProvider'
import { useNavigate } from 'react-router'
import { Link } from 'react-router'
import './Navbar.css'

export default function Navbar() {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()
  const [logoutError, setLogoutError] = useState('')

  async function handleLogout() {
    setLogoutError('')

    try {
      await logout()
      navigate('/', { replace: true })
    } catch {
      setLogoutError('Uloskirjautuminen epäonnistui. Yritä uudelleen.')
    }
  }

  function handleSearch(event) {
    event.preventDefault()
    const query = event.currentTarget.elements.query.value.trim()
    if (!query) return

    navigate(`/search?query=${encodeURIComponent(query)}`)
  }

  return (
    <nav className="navbar md:navbar-expand bg-1">
      <div className="container-fluid">
        <button className="btn-icon navbar-toggler" type="button" data-bs-toggle="drawer" data-bs-target="#navbarDrawer" aria-controls="navbarDrawer" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" aria-hidden="true"></span>
        </button>
        <dialog className="drawer drawer-end" tabIndex="-1" id="navbarDrawer" aria-labelledby="navbarDrawerLabel">
          <div className="drawer-header">
            <h5 className="drawer-title" id="navbarDrawerLabel">Menu</h5>
            <button type="button" className="btn-close" data-bs-dismiss="drawer" aria-label="Close"></button>
          </div>
          <div className="drawer-body mb-2 md:mb-0">
            <ul className="nav navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/" draggable={false}>Etusivu</Link>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link" type="button" data-bs-toggle="menu" aria-expanded="false" id="moviesMenu">
                  Elokuvat ▾
                </button>
                <div className="menu" aria-labelledby="moviesMenu">
                  <Link className="menu-item" to="/movies">Kaikki elokuvat</Link>
                  <Link className="menu-item" to="/movies?sort=newest">Uusimmat</Link>
                  <Link className="menu-item" to="/movies?sort=popular">Suosituimmat</Link>
                  <Link className="menu-item" to="/movies?sort=top_rated">Parhaiten arvostellut</Link>
                </div>
              </li>
              {!loading && (
                user ? (
                  <>
                    <li className="nav-item">
                      <span className="nav-link">
                        {user.username}
                      </span>
                    </li>

                    <li className="nav-item">
                      <button type="button" onClick={handleLogout}>
                        Kirjaudu ulos
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/login" draggable={false}>
                        Kirjaudu
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/register" draggable={false}>
                        Rekisteröidy
                      </Link>
                    </li>
                  </>
                )
              )}

              <li className="nav-item">
                <form className="d-flex" role="search" onSubmit={handleSearch}>
                  <input className="form-control me-2" name="query" type="search" placeholder="Elokuva tai näyttelijä" aria-label="Hae elokuvaa tai näyttelijää" required />
                  <button className="btn btn-outline-success" type="submit">Hae</button>
                </form>
              </li>
              <li className="nav-item profile-link">
                <Link className="nav-link" to="/profile" aria-label="Profiili" draggable={false}>
                  <svg xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none" stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-user preview-icon">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" /></svg></Link>
              </li>
            </ul>
          </div>
        </dialog>
      </div>
    </nav>
  )
}