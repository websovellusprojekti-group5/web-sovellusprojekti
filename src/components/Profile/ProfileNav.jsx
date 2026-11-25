import { Link } from 'react-router'

export default function ProfileNav({userId}) {
    return (
        <nav className="profile-nav" aria-label="Profiilin valinnat">
            <Link className="profile-reviews-link" to={`/users/${userId}/lists`}>
                Listat
            </Link>

            <Link className="profile-reviews-link" to={`/users/${userId}/reviews`}>
                Arvostelut
            </Link>
            <details className="profile-dropdown">
                <summary>Ryhmät</summary>

                <div className="profile-dropdown-content">
                    <p>Et kuulu vielä yhteenkään ryhmään.</p>
                </div>
            </details>
        </nav>
    )
}