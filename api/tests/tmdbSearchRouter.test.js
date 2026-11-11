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
