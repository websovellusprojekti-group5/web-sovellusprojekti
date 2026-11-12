export async function api(path, options = {}) {
    const response = await fetch('/api' + path, {
        ...options,
        headers: {
            'Content-Type':'application/json',
            ...options.headers
        }
    })
    const data = await response.json()
    
    if (!response.ok) {
        const error = new Error(data.message || 'Pyyntö epäonnistui')
        error.status = response.status
        throw error
    }
    return data
}
