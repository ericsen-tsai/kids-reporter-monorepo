import {
  V1AuthorBySlugMetaResponseSchema,
  V1AuthorBySlugPostsResponseSchema,
  V1AuthorPostsCountResponseSchema,
} from '@kids-reporter/api-types'
import type { z } from 'zod'

import {
  ContentApiRequestError,
  sendContentApiRequest,
} from '@/utils/send-content-api'

import { normalizePostCardsForGql } from './normalize-post-for-gql'

export async function getAuthorMetaContentApi({
  slug,
  traceHeaders,
}: {
  slug: string
  traceHeaders?: Record<string, string>
}) {
  const enc = encodeURIComponent(slug)
  const response = await sendContentApiRequest({
    path: `/v1/authors/by-slug/${enc}/meta`,
    traceHeaders,
  })
  const parsed = V1AuthorBySlugMetaResponseSchema.safeParse(response)
  if (!parsed.success) {
    throw new Error('content-api schema mismatch author meta')
  }
  const a = parsed.data
  return {
    ...a,
    bio: a.bio ?? undefined,
    image: a.image ?? undefined,
  }
}

export async function getAuthorPostsCountContentApi({
  slug,
  traceHeaders,
}: {
  slug: string
  traceHeaders?: Headers | Record<string, string | undefined>
}): Promise<z.infer<typeof V1AuthorPostsCountResponseSchema> | undefined> {
  try {
    const enc = encodeURIComponent(slug)
    const response = await sendContentApiRequest({
      path: `/v1/authors/by-slug/${enc}/posts-count`,
      traceHeaders,
    })
    const parsed = V1AuthorPostsCountResponseSchema.safeParse(response)
    if (!parsed.success) {
      throw new Error('content-api schema mismatch author posts-count')
    }
    return parsed.data
  } catch (e) {
    if (e instanceof ContentApiRequestError && e.status === 404) {
      return undefined
    }
    throw e
  }
}

export async function getAuthorPostsContentApi({
  slug,
  take,
  skip,
  orderBy,
  traceHeaders,
}: {
  slug: string
  take?: number
  skip?: number
  orderBy?: string
  traceHeaders?: Record<string, string>
}) {
  const enc = encodeURIComponent(slug)
  const response = await sendContentApiRequest({
    path: `/v1/authors/by-slug/${enc}/posts`,
    query: { take, skip, orderBy: orderBy ?? 'publishedDate:desc' },
    traceHeaders,
  })
  const parsed = V1AuthorBySlugPostsResponseSchema.safeParse(response)
  if (!parsed.success) {
    throw new Error('content-api schema mismatch author posts')
  }
  const a = parsed.data
  return {
    ...a,
    bio: a.bio ?? undefined,
    email: a.email ?? undefined,
    avatar: a.avatar ?? undefined,
    posts: normalizePostCardsForGql(a.posts),
  }
}
