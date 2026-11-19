import { useAuth } from '../auth/AuthProvider'
import ProfileHeader from '../components/Profile/ProfileHeader'
import ProfileNav from '../components/Profile/ProfileNav'
import './Profile.css'

export default function Profile() {
    const { user, loading } = useAuth()

    if (loading) return <p>Ladataan profiilia…</p>
    if (!user) return <p>Kirjaudu sisään nähdäksesi profiilisi</p>

    return (
        <div className="profile-page">
            <ProfileHeader user={user} />
            <ProfileNav />
        </div>
    )
}