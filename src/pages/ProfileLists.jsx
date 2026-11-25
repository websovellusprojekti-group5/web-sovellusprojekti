import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import {useAuth} from '../auth/AuthProvider'
import {api} from '../api'
import ProfileHeader from '../components/Profile/ProfileHeader'
import './Profile.css'

export default function ProfileLists() {
const {userId} = useParams()
const {user, loading: authLoading} = useAuth()

const [profile, setProfile] = useState(null)
const [lists, setLists] = useState([])
const [loading, setLoading] = useState(true)
const [error,setError] = useState('')

const targetUserId = userId ?? user?.id

useEffect(() => {
    if (authLoading || !user || !targetUserId) return
    
    const controller = new AbortController()

    async function loadLists() {
        setLoading(true)
        setError('')

        try {
            const data = await api(`/users/${targetUserId}/lists`,
                {signal: controller.signal}
            )
            setProfile(data.profile)
            setLists(data.lists)
        } catch (error) {
            if (controller.signal.aborted) return

            setError(
                error.status === 403
                    ? 'Ei oikeutta tämän käyttäjän listojen katseluun.'
                    : error.status === 401
                        ? 'Kirjaudu sisään nähdäksesi listat.'
                        : error.message
            )
        } finally {
            if (!controller.signal.aborted) {
                setLoading(false)
            }
        }
    }
    loadLists()

    return () => controller.abort()
}, [authLoading,user,targetUserId])

if (authLoading) return <p>Ladataan...</p>
if (!user) return <p>Kirjaudu sisään nähdäksesi listat.</p>
if (loading) return <p>Ladataan listoja...</p>
if (error) return <p role="alert">{error}</p>
if (!profile) return <p>Profiilia ei löytynyt.</p>


    return (
        <div className="profile-page">
            <ProfileHeader user={profile} />

            <section>
                <h1>Käyttäjän {profile.username} listat</h1>

                {lists.length === 0 ? (
                    <p>Ei vielä listoja.</p>
                ) : (
                    lists.map(list => (
                        <article key={list.id}>
                            <h2>{list.name}</h2>
                        </article>
                    ))
                )}
            </section>
        </div>
    )
}