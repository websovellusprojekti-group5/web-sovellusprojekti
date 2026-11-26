import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from '../../api'

export default function ProfileGroups() {
    const [groups, setGroups] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState([])

    useEffect(() => {
        const controller = new AbortController()

        async function loadGroups() {
            try {
                const data = await api('/groups/mine', {
                    signal: controller.signal,
                })
                if (!controller.signal.aborted) {
                    setGroups(data.groups)
                }
            } catch (error) {
                if (controller.signal.aborted) return
                setError('Ryhmien hakeminen epäonnistui.')
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false)
                }
            }
        }
        loadGroups()

        return () => controller.abort()

    }, [])
    return (
        <details className="profile-dropdown">
            <summary>Ryhmät</summary>

            <div className="profile-dropdown-content">
                {loading ? (
                    <p role="status">Ladataan ryhmiä...</p>
                ) : error ? (
                    <p role="alert">{error}</p>
                ) : groups.length === 0 ? (
                    <p>Et ole vielä luonut ryhmiä.</p>
                ) : (
                    <ul>
                        {groups.map(group => (
                            <li key={group.id}>{group.name}</li>
                        ))}
                    </ul>
                )}

                <Link to="/groups/new">Luo uusi ryhmä</Link>
            </div>
        </details>

    )
}
