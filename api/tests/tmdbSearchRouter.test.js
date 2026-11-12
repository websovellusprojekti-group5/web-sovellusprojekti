import express from 'express'
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import tmdbSearchRouter from '../routes/tmdbSearchRouter.js'
import errorHandler from '../middleware/errorHandler.js'

const app = express()
app.use('/api/tmdb/search', tmdbSearchRouter)
app.use(errorHandler)

describe('GET /api/tmdb/search', () => {
    let fetchMock

    beforeEach(()=>{
        vi.stubEnv('TMDB_API_KEY', 'test-key')
        fetchMock = vi.fn()
        vi.stubGlobal('fetch', fetchMock)
    })

    afterEach(()=>{
        vi.unstubAllGlobals()
        vi.unstubAllEnvs()
    })

    it('returns 400 when the query is missing',async()=>{
        const response = await request(app).get('/api/tmdb/search')

        expect(response.status).toBe(400)
        expect(response.body.error).toBe('Search query is required')
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it('returns 400 for repeated query parameters', async() =>{
        const response = await request(app).get('/api/tmdb/search?query=Alien&query=Avatar')

        expect(response.status).toBe(400)
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it('returns 400 for a whitespace-only query', async () => {
        const response = await request(app)
            .get('/api/tmdb/search')
            .query({ query: '   ' })

        expect(response.status).toBe(400)
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it('returns 500 when the API key is missing', async () => {
        vi.stubEnv('TMDB_API_KEY', undefined)

        const response = await request(app)
            .get('/api/tmdb/search')
            .query({ query: 'Alien' })

        expect(response.status).toBe(500)
        expect(response.body.error).toBe('TMDB API key is not configured')
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it.each(['movie', 'keyword'])(
        'returns the TMDB error status when the %s search fails',
        async (failedSearch) => {
            const success = { ok: true, json: async () => ({ results: [] }) }
            const failure = { ok: false, status: 429 }

            fetchMock
                .mockResolvedValueOnce(failedSearch === 'movie' ? failure : success)
                .mockResolvedValueOnce(failedSearch === 'keyword' ? failure : success)

            const response = await request(app)
                .get('/api/tmdb/search')
                .query({ query: 'Alien' })

            expect(response.status).toBe(429)
            expect(response.body.error).toBe('TMDB API request failed')
        }
    )

    it('passes network failures to the error handler', async () => {
        fetchMock.mockRejectedValue(new Error('Network unavailable'))

        const response = await request(app)
            .get('/api/tmdb/search')
            .query({ query: 'Alien' })

        expect(response.status).toBe(500)
        expect(response.body.error).toEqual({
            message: 'Network unavailable',
            status: 500
        })
    })

    it('combines title and keyword movies without duplicates', async () => {
        const titleMatch = { id: 348, title: 'Alien' }
        const keywordMatch = { id: 679, title: 'Aliens' }

        fetchMock
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ results: [titleMatch] })
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ results: [{ id: 123 }, { id: 456 }] })
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ results: [titleMatch, keywordMatch] })
            })

        const response = await request(app)
            .get('/api/tmdb/search')
            .query({ query: '  Alien  ' })

        expect(response.status).toBe(200)
        expect(response.body.results).toEqual([titleMatch, keywordMatch])
        expect(response.body.total_results).toBe(2)
        expect(fetchMock).toHaveBeenCalledTimes(3)

        // Check that user input and keyword IDs reach the correct TMDB requests.
        const movieUrl = new URL(fetchMock.mock.calls[0][0])
        const discoverUrl = new URL(fetchMock.mock.calls[2][0])
        expect(movieUrl.searchParams.get('query')).toBe('Alien')
        expect(discoverUrl.pathname).toBe('/3/discover/movie')
        expect(discoverUrl.searchParams.get('with_keywords')).toBe('123|456')
    })

    it('returns an error when keyword movie discovery fails', async () => {
        fetchMock
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ results: [] })
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ results: [{ id: 123 }] })
            })
            .mockResolvedValueOnce({ ok: false, status: 503 })

        const response = await request(app)
            .get('/api/tmdb/search')
            .query({ query: 'space' })

        expect(response.status).toBe(503)
        expect(response.body.error).toBe('TMDB API request failed')
    })

    it('returns an empty list when neither search finds matches', async () => {
        fetchMock.mockResolvedValue({
            ok: true,
            json: async () => ({ results: [] })
        })

        const response = await request(app)
            .get('/api/tmdb/search')
            .query({ query: 'no-matching-movie' })

        expect(response.status).toBe(200)
        expect(response.body.results).toEqual([])
        expect(response.body.total_results).toBe(0)
        expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    it('returns movie matches when no keywords match', async()=>{
        const movies = [{id: 348, title: 'Alien'}]

        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async()=>({results: movies})
        })
        .mockResolvedValueOnce({
            ok: true,
            json: async () => ({results: []})
        })

        const response = await request(app)
        .get('/api/tmdb/search')
        .query({query: 'Alien'})

        expect(response.status).toBe(200)
        expect(response.body.results).toEqual(movies)
        expect(response.body.total_results).toBe(1)
    })
})
