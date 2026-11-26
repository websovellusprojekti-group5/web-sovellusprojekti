import { Link } from 'react-router'
import ProfileGroups from './ProfileGroups'

export default function ProfileNav({ userId }) {
    return (
        <nav className="profile-nav" aria-label="Profiilin valinnat">
            <Link className="profile-reviews-link" to={`/users/${userId}/lists`}>
                Listat
            </Link>

            <Link className="profile-reviews-link" to={`/users/${userId}/reviews`}>
                Arvostelut
            </Link>
            <ProfileGroups/>
        </nav>
    )
}