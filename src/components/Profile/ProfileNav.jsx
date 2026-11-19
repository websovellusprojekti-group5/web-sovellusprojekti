import { Link } from 'react-router'

export default function ProfileNav() {
    return (
        <nav className="profile-nav" aria-label="Profiilin valinnat">
            <Link className="profile-reviews-link" to="/profile/lists">
                Listat
            </Link>

            <details className="profile-dropdown">
                <summary>Ryhmät</summary>

                <div className="profile-dropdown-content">
                    <p>Et kuulu vielä yhteenkään ryhmään.</p>
                </div>
            </details>

            <Link className="profile-reviews-link" to="/profile/reviews">
                Arvostelut
            </Link>
        </nav>
    )
}