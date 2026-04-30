import {
  RestErrorBodySchema,
  V1CallBaodaozaiIntroResponseSchema,
  V1CategoryBySlugCategoryPostsResponseSchema,
  V1CategoryBySlugMetadataResponseSchema,
  V1EditorPicksSettingsResponseSchema,
  V1PopularKeywordsResponseSchema,
  V1PostsResponseSchema,
  V1ProjectsListResponseSchema,
  V1SubcategoriesResponseSchema,
  V1TopicProjectsResponseSchema,
} from '@kids-reporter/api-types'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import type { z } from 'zod'

import { createApp } from './app.js'

const describeWithDb = process.env.DATABASE_URL ? describe : describe.skip
const app = createApp({ corsAllowOrigin: '*' })

async function expectRouteMatchesSchema(
  path: string,
  schema: z.ZodTypeAny,
  expectedStatus = 200
) {
  const res = await request(app).get(path)
  expect(res.status).toBe(expectedStatus)
  expect(schema.safeParse(res.body).success).toBe(true)
}

describe('content-api response contracts', () => {
  it('requires DATABASE_URL in CI when running DB-backed contract checks', () => {
    if (process.env.CI) {
      expect(process.env.DATABASE_URL).toBeTruthy()
    }
  })

  it('GET /healthz returns payload-only {}', async () => {
    const res = await request(app).get('/healthz')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({})
  })

  it('POST /auth/access-token without Origin/Referer returns { error }', async () => {
    const res = await request(app).post('/auth/access-token')
    expect(res.status).toBe(403)
    expect(res.body?.error?.code).toBe('forbidden')
    expect(typeof res.body?.error?.message).toBe('string')
  })

  it('POST /auth/access-token missing id_token cookie returns { error }', async () => {
    const res = await request(app)
      .post('/auth/access-token')
      .set('Origin', 'https://kids.twreporter.org')
    expect(res.status).toBe(400)
    expect(res.body?.error?.code).toBe('invalid_request')
  })

  it('GET /v1/posts invalid query returns { error } with invalid_request', async () => {
    const res = await request(app).get('/v1/posts?take=abc')
    expect(res.status).toBe(400)
    expect(res.body?.error?.code).toBe('invalid_request')
  })

  it('GET /v1/posts/essay-answers-with-likes without variables returns { error }', async () => {
    const res = await request(app).get('/v1/posts/essay-answers-with-likes')
    expect(res.status).toBe(400)
    expect(res.body?.error?.code).toBe('invalid_request')
  })

  it('GET /v1/posts/by-slug/x with invalid variables JSON returns { error }', async () => {
    const res = await request(app).get(
      '/v1/posts/by-slug/x?variables=not-json{{{'
    )
    expect(res.status).toBe(400)
    expect(res.body?.error?.code).toBe('invalid_request')
  })

  it('GET /v1/posts/by-slug/x rejects decimal take in variables', async () => {
    const variables = encodeURIComponent(JSON.stringify({ take: 1.5 }))
    const res = await request(app).get(
      `/v1/posts/by-slug/x?variables=${variables}`
    )
    expect(res.status).toBe(400)
    expect(res.body?.error?.code).toBe('invalid_request')
  })

  it('GET /v1/posts/essay-answers-with-likes rejects decimal values', async () => {
    const variables = encodeURIComponent(
      JSON.stringify({
        take: 2.2,
        answerTake: 1,
        where: { id: { gt: 0 } },
      })
    )
    const res = await request(app).get(
      `/v1/posts/essay-answers-with-likes?variables=${variables}`
    )
    expect(res.status).toBe(400)
    expect(res.body?.error?.code).toBe('invalid_request')
  })

  it('GET /v1/posts/by-slug/x rejects array relatedPostsWhere in variables', async () => {
    const variables = encodeURIComponent(
      JSON.stringify({
        relatedPostsWhere: [],
      })
    )
    const res = await request(app).get(
      `/v1/posts/by-slug/x?variables=${variables}`
    )
    expect(res.status).toBe(400)
    expect(res.body?.error?.code).toBe('invalid_request')
  })

  it('GET /v1/posts/essay-answers-with-likes rejects array where', async () => {
    const variables = encodeURIComponent(
      JSON.stringify({
        where: [],
      })
    )
    const res = await request(app).get(
      `/v1/posts/essay-answers-with-likes?variables=${variables}`
    )
    expect(res.status).toBe(400)
    expect(res.body?.error?.code).toBe('invalid_request')
  })

  it('GET /v1/post-essay-questions/:questionId/answers rejects decimal questionId', async () => {
    const res = await request(app).get('/v1/post-essay-questions/1.5/answers')
    expect(res.status).toBe(400)
    expect(res.body?.error?.code).toBe('invalid_request')
  })

  it('GET /v1/post-essay-questions/:questionId/answers rejects non-positive questionId', async () => {
    const res = await request(app).get('/v1/post-essay-questions/0/answers')
    expect(res.status).toBe(400)
    expect(res.body?.error?.code).toBe('invalid_request')
  })

  describeWithDb('metadata query normalization (requires DB)', () => {
    it('GET /v1/categories/by-slug/x/metadata uses first subcategorySlug when repeated', async () => {
      const res = await request(app).get(
        '/v1/categories/by-slug/x/metadata?subcategorySlug=a&subcategorySlug=b'
      )
      expect([200, 404]).toContain(res.status)
      if (res.status === 200) {
        expect(
          V1CategoryBySlugMetadataResponseSchema.safeParse(res.body).success
        ).toBe(true)
      } else {
        expect(RestErrorBodySchema.safeParse(res.body).success).toBe(true)
        expect(res.body?.error?.code).toBe('not_found')
      }
    })
  })

  it('GET /v1/call-baodaozai-intros/:page rejects invalid page enum', async () => {
    const res = await request(app).get('/v1/call-baodaozai-intros/not-a-page')
    expect(res.status).toBe(400)
    expect(res.body?.error?.code).toBe('invalid_request')
  })

  describeWithDb('with DATABASE_URL (response shape vs api-types)', () => {
    it('GET /v1/posts success body matches V1PostsResponseSchema', async () => {
      await expectRouteMatchesSchema('/v1/posts', V1PostsResponseSchema)
    })

    it('GET /v1/subcategories success body matches V1SubcategoriesResponseSchema', async () => {
      await expectRouteMatchesSchema(
        '/v1/subcategories',
        V1SubcategoriesResponseSchema
      )
    })

    it('GET /v1/popular-keywords success body matches V1PopularKeywordsResponseSchema', async () => {
      await expectRouteMatchesSchema(
        '/v1/popular-keywords',
        V1PopularKeywordsResponseSchema
      )
    })

    it('GET /v1/editor-picks-settings success body matches V1EditorPicksSettingsResponseSchema', async () => {
      await expectRouteMatchesSchema(
        '/v1/editor-picks-settings',
        V1EditorPicksSettingsResponseSchema
      )
    })

    it('GET /v1/projects/topics success body matches V1TopicProjectsResponseSchema', async () => {
      await expectRouteMatchesSchema(
        '/v1/projects/topics',
        V1TopicProjectsResponseSchema
      )
    })

    it('GET /v1/projects success body matches V1ProjectsListResponseSchema', async () => {
      await expectRouteMatchesSchema(
        '/v1/projects',
        V1ProjectsListResponseSchema
      )
    })

    it('GET /v1/categories/by-slug/unknown-feed-slug/posts success body matches category posts schema', async () => {
      await expectRouteMatchesSchema(
        '/v1/categories/by-slug/unknown-feed-slug/posts',
        V1CategoryBySlugCategoryPostsResponseSchema
      )
    })

    it('GET /v1/call-baodaozai-intros/home 200 or 404 with matching body shape', async () => {
      const app = createApp({ corsAllowOrigin: '*' })
      const res = await request(app).get('/v1/call-baodaozai-intros/home')
      if (res.status === 200) {
        expect(
          V1CallBaodaozaiIntroResponseSchema.safeParse(res.body).success
        ).toBe(true)
      } else {
        expect(res.status).toBe(404)
      }
    })
  })
})
