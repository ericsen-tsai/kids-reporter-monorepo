import { describe, expect, it, vi } from 'vitest'

import { verifyGoApiJwt } from './verify-go-api-jwt.js'

describe('verifyGoApiJwt', () => {
  it('returns 401 when Authorization header is missing', () => {
    const req = { headers: {} } as any
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any
    const next = vi.fn()

    verifyGoApiJwt(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('returns 401 when Bearer token is empty', () => {
    const req = { headers: { authorization: 'Bearer   ' } } as any
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any
    const next = vi.fn()

    verifyGoApiJwt(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('returns 401 when token verification throws', async () => {
    const mod = await import('../go-api-jwt.js')
    vi.spyOn(mod, 'verifyGoApiAccessToken').mockImplementation(() => {
      throw new Error('bad token')
    })

    const req = { headers: { authorization: 'Bearer t' } } as any
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any
    const next = vi.fn()

    verifyGoApiJwt(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('sets req.goApiJwtUserId and calls next on success', async () => {
    const mod = await import('../go-api-jwt.js')
    vi.spyOn(mod, 'verifyGoApiAccessToken').mockReturnValue({
      user_id: 'u1',
    } as any)

    const req = { headers: { authorization: 'Bearer t' } } as any
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any
    const next = vi.fn()

    verifyGoApiJwt(req, res, next)

    expect(req.goApiJwtUserId).toBe('u1')
    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })
})
