import { useAuth } from '../auth/AuthProvider'
import ProfileHeader from '../components/Profile/ProfileHeader'
import './Profile.css'

export default function ProfileReviews() {
    const { user, loading } = useAuth()

    if (loading) return <p>Ladataan profiilia…</p>
    if (!user) return <p>Kirjaudu sisään nähdäksesi arvostelusi</p>
  return (
    <div className="profile-page">
                <ProfileHeader user={user} />
    
                <section>
                    <h1>Omat arvostelut</h1>
                    <p>Ei vielä arvosteluja.</p>
                </section>
            </div>
  )
}
