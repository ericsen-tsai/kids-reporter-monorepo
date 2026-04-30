import {
  V1AuthorBySlugMetaResponseSchema,
  V1AuthorBySlugPostsResponseSchema,
} from '@kids-reporter/api-types'

import { sendContentApiRequest } from '@/utils/send-content-api'

import { normalizePostCardsForGql } from './normalize-post-for-gql'

export async function getAuthorMetaContentApi({ slug }: { slug: string }) {
  const enc = encodeURIComponent(slug)
  const response = await sendContentApiRequest({
    path: `/v1/authors/by-slug/${enc}/meta`,
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
