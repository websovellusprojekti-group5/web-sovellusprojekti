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

    it("includes an actor's movie credits without duplicating movie results", async () => {
        const titleMatch = {id: 603, title: 'The Matrix'}
        const actorCredit = {id: 603, title: 'The Matrix'}
        const secondCredit = {id: 550, title: 'Fight Club'}

        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({results: [titleMatch]})
        })
        .mockResolvedValueOnce({
            ok: true,
            json: async () => ({results: []})
        })
        .mockResolvedValueOnce({
            ok: true,
            json: async () => ({results: [{id: 6384, name: 'Keanu Reeves'}]})
        })
        .mockResolvedValueOnce({
            ok: true,
            json: async () => ({cast: [actorCredit, secondCredit]})
        })

        const response = await request(app)
        .get('/api/tmdb/search')
        .query({query: 'Keanu Reeves'})

        expect(response.status).toBe(200)
        expect(response.body.results).toEqual([titleMatch, secondCredit])
        expect(response.body.total_results).toBe(2)
        expect(fetchMock.mock.calls[3][0].pathname).toBe('/3/person/6384/movie_credits')
    })
})
