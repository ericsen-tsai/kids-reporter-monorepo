import { verifyGoApiJwt } from '@kids-reporter/content-api-kit/auth/go-api-jwt'
import jwt from 'jsonwebtoken'
import { describe, expect, it, vi } from 'vitest'

describe('verifyGoApiJwt', () => {
  it('returns 401 when Authorization header is missing', () => {
    const req = { headers: {}, method: 'GET', originalUrl: '/x' } as any
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      locals: {},
    } as any
    const next = vi.fn()

    const onReject = vi.fn()
    verifyGoApiJwt({ secret: 's', onReject })(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
    expect(onReject).toHaveBeenCalledWith(
      expect.objectContaining({ reason: 'missing_authorization_header' })
    )
  })

  it('returns 401 when Bearer token is empty', () => {
    const req = {
      headers: { authorization: 'Bearer   ' },
      method: 'GET',
      originalUrl: '/x',
    } as any
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      locals: {},
    } as any
    const next = vi.fn()

    const onReject = vi.fn()
    verifyGoApiJwt({ secret: 's', onReject })(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
    expect(onReject).toHaveBeenCalledWith(
      expect.objectContaining({ reason: 'empty_bearer_token' })
    )
  })

  it('returns 401 and logs jwt_expired when token is expired', async () => {
    const req = {
      headers: { authorization: 'Bearer t' },
      method: 'GET',
      originalUrl: '/x',
    } as any
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      locals: {},
    } as any
    const next = vi.fn()

    const onReject = vi.fn()
    verifyGoApiJwt({ secret: 's', onReject, issuer: 'https://issuer' })(
      req,
      res,
      next
    )

    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
    expect(onReject).toHaveBeenCalled()
  })

  it('returns 401 and logs jwt_invalid_signature', async () => {
    const req = {
      headers: { authorization: 'Bearer t' },
      method: 'GET',
      originalUrl: '/x',
    } as any
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      locals: {},
    } as any
    const next = vi.fn()

    const onReject = vi.fn()
    verifyGoApiJwt({ secret: 's', onReject })(req, res, next)
    expect(onReject).toHaveBeenCalled()
  })

  it('returns 401 when token verification throws unknown Error', async () => {
    const req = {
      headers: { authorization: 'Bearer t' },
      method: 'GET',
      originalUrl: '/x',
    } as any
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      locals: {},
    } as any
    const next = vi.fn()

    const onReject = vi.fn()
    verifyGoApiJwt({ secret: 's', onReject })(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
    expect(onReject).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: 'jwt_verification_failed',
        jwtLibraryErrorName: 'JsonWebTokenError',
      })
    )
  })

  it('sets req.goApiJwtUserId and calls next on success', async () => {
    const token = jwt.sign({ user_id: 'u1' }, 's', {
      algorithm: 'HS256',
      expiresIn: '1h',
    })

    const req = { headers: { authorization: `Bearer ${token}` } } as any
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any
    const next = vi.fn()

    verifyGoApiJwt({ secret: 's' })(req, res, next)

    expect(req.goApiJwtUserId).toBe('u1')
    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })
})
