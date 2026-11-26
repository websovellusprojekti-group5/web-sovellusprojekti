import express from 'express'
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../models/Review.js', () => ({
  createReview: vi.fn(),
  findMovieReviews: vi.fn(),
}))
vi.mock('../middleware/requireAuth.js', () => ({ requireAuth: vi.fn() }))

import { createReview, findMovieReviews } from '../models/Review.js'
import { requireAuth } from '../middleware/requireAuth.js'
import reviewRouter from '../routes/reviewRouter.js'
import errorHandler from '../middleware/errorHandler.js'

const app = express()
app.use(express.json())
app.use('/api/movies', reviewRouter)
app.use(errorHandler)

beforeEach(() => {
  vi.resetAllMocks()
  vi.stubEnv('TMDB_API_KEY', 'test-key')
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true, json: async () => ({ id: 348, title: 'Alien' })
  }))
  requireAuth.mockImplementation((req, res, next) => {
    req.user = { id: 7, username: 'Testaaja' }
    next()
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('Movie reviews API', () => {
  it('allows reading public reviews without authentication', async () => {
    findMovieReviews.mockResolvedValue([{ id: 1, rating: 4, username: 'Testaaja' }])
    const response = await request(app).get('/api/movies/348/reviews')
    expect(response.status).toBe(200)
    expect(response.body.reviews).toHaveLength(1)
    expect(findMovieReviews).toHaveBeenCalledWith(348)
    expect(requireAuth).not.toHaveBeenCalled()
  })

  it.each(['abc', '0', '-1', '2147483648'])('rejects invalid movie ID %s', async id => {
    const response = await request(app).get(`/api/movies/${id}/reviews`)
    expect(response.status).toBe(400)
    expect(findMovieReviews).not.toHaveBeenCalled()
  })

  it('rejects unauthenticated submissions', async () => {
    requireAuth.mockImplementation((req, res) => res.status(401).json({ message: 'Kirjautuminen vaaditaan' }))
    const response = await request(app).post('/api/movies/348/reviews').send({ rating: 4 })
    expect(response.status).toBe(401)
    expect(createReview).not.toHaveBeenCalled()
  })

  it.each([0, 6, 2.5, '4', null])('rejects invalid rating %s', async rating => {
    const response = await request(app).post('/api/movies/348/reviews').send({ rating })
    expect(response.status).toBe(400)
    expect(createReview).not.toHaveBeenCalled()
  })

  it.each([null, 123, 'a'.repeat(2001)])('rejects invalid comment (case %#)', async comment => {
    const response = await request(app).post('/api/movies/348/reviews').send({ rating: 4, comment })
    expect(response.status).toBe(400)
    expect(createReview).not.toHaveBeenCalled()
  })

  it('uses the authenticated user instead of a submitted user ID', async () => {
    createReview.mockResolvedValue({ id: 10, rating: 4, comment: 'Hyvä' })
    const response = await request(app).post('/api/movies/348/reviews')
      .send({ user_id: 999, rating: 4, comment: '  Hyvä  ' })
    expect(response.status).toBe(201)
    expect(createReview).toHaveBeenCalledWith(7, { id: 348, title: 'Alien' }, 4, 'Hyvä')
    expect(response.body.review.username).toBe('Testaaja')
  })

  it('accepts a rating without a comment', async () => {
    createReview.mockResolvedValue({ id: 11, rating: 5, comment: '' })
    const response = await request(app).post('/api/movies/348/reviews').send({ rating: 5 })
    expect(response.status).toBe(201)
    expect(createReview).toHaveBeenCalledWith(7, { id: 348, title: 'Alien' }, 5, '')
  })

  it('passes storage failures to the error handler', async () => {
    createReview.mockRejectedValue(new Error('Database unavailable'))
    const response = await request(app).post('/api/movies/348/reviews').send({ rating: 4 })
    expect(response.status).toBe(500)
  })

  it('does not save a review for a nonexistent TMDB movie', async () => {
    fetch.mockResolvedValue({ ok: false, status: 404 })
    const response = await request(app).post('/api/movies/348/reviews').send({ rating: 4 })
    expect(response.status).toBe(404)
    expect(createReview).not.toHaveBeenCalled()
  })

  it('does not save a review when TMDB is unavailable', async () => {
    fetch.mockResolvedValue({ ok: false, status: 503 })
    const response = await request(app).post('/api/movies/348/reviews').send({ rating: 4 })
    expect(response.status).toBe(502)
    expect(createReview).not.toHaveBeenCalled()
  })
})
