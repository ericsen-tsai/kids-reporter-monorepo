import jwt from 'jsonwebtoken'
import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createApp } from './app.js'

const { mockFindMember, mockCreateBookmark, mockFindPost } = vi.hoisted(() => ({
  mockFindMember: vi.fn(),
  mockCreateBookmark: vi.fn(),
  mockFindPost: vi.fn(),
}))

vi.mock('@kids-reporter/db', () => ({
  Prisma: {
    PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {
      code: string
      constructor(message: string, { code }: { code: string }) {
        super(message)
        this.code = code
      }
    },
  },
  prisma: {
    member: {
      findUnique: (...args: unknown[]) => mockFindMember(...args),
    },
    post: {
      findFirst: (...args: unknown[]) => mockFindPost(...args),
    },
    project: {
      findFirst: vi.fn(),
    },
    bookmark: {
      create: (...args: unknown[]) => mockCreateBookmark(...args),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

describe('POST /v1/members/me/bookmarks', () => {
  const secret = process.env.GO_API_JWT_SECRET!
  const issuer = process.env.GO_API_JWT_ISSUER!
  const audience = process.env.GO_API_JWT_AUDIENCE!

  beforeEach(() => {
    mockFindMember.mockReset()
    mockCreateBookmark.mockReset()
    mockFindPost.mockReset()
  })

  it('returns 401 without Authorization', async () => {
    const app = createApp({ corsAllowOrigin: ['https://kids.twreporter.org'] })
    const res = await request(app)
      .post('/v1/members/me/bookmarks')
      .send({ type: 'post', slug: 'hello' })

    expect(res.status).toBe(401)
    expect(mockCreateBookmark).not.toHaveBeenCalled()
  })

  it('creates a post bookmark for an authenticated member', async () => {
    const accessJwt = jwt.sign(
      {
        user_id: 'tw-user-bookmark',
        email: 'bookmark@vitest.example',
        iss: issuer,
        aud: audience,
      },
      secret,
      { algorithm: 'HS256' }
    )

    mockFindMember.mockResolvedValue({
      id: 'member-cuid-1',
      role: 'member',
    })
    mockFindPost.mockResolvedValue({ id: 42, slug: 'hello-article' })
    mockCreateBookmark.mockResolvedValue({ id: 7 })

    const app = createApp({ corsAllowOrigin: ['https://kids.twreporter.org'] })
    const res = await request(app)
      .post('/v1/members/me/bookmarks')
      .set('Authorization', `Bearer ${accessJwt}`)
      .send({ type: 'post', slug: 'hello-article' })

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      id: '7',
      type: 'post',
      slug: 'hello-article',
    })
    expect(mockCreateBookmark).toHaveBeenCalledWith({
      data: {
        type: 'post',
        postId: 42,
        memberId: 'member-cuid-1',
        compositeKey: 'post:42:member-cuid-1',
      },
      select: { id: true },
    })
  })
})
