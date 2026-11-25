import {useEffect, useState} from 'react'
import {api} from '../api'

export default function Groups() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchGroups() {
      try {
        const data = await api('/groups')
        setGroups(data.groups)
      } catch (error) {
        setError(
          error.status === 401
          ? 'Kirjaudu sisään nähdäksesi ryhmät.'
          : 'Ryhmien hakeminen epäonnistui. Yritä myöhemmin uudelleen.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchGroups()
  }, [])

  return (
    <section>
      <h1>Ryhmät</h1>
      {loading && <p role="status">Ladataan ryhmiä…</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && groups.length === 0 && <p>Ryhmiä ei löytynyt.</p>}
      {groups.map(group => (
        <article key={group.id}>
          <h2>{group.name}</h2>
          <p>{group.description}</p>
        </article>
      ))}
    </section>
  )
}