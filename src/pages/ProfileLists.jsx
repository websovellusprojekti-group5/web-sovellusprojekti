import { useAuth } from '../auth/AuthProvider'
import ProfileHeader from '../components/Profile/ProfileHeader'
import './Profile.css'

export default function ProfileLists() {
    const { user, loading } = useAuth()

    if (loading) return <p>Ladataan profiilia…</p>
    if (!user) return <p>Kirjaudu sisään nähdäksesi listasi</p>

    return (
        <div className="profile-page">
            <ProfileHeader user={user} />

            <section>
                <h1>Omat listat</h1>
                <p>Ei vielä listoja.</p>
            </section>
        </div>
    )
}