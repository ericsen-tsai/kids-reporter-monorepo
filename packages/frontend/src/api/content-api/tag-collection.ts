import {
  V1TagBySlugMetaResponseSchema,
  V1TagBySlugPostsResponseSchema,
} from '@kids-reporter/api-types'

import { sendContentApiRequest } from '@/utils/send-content-api'

import { normalizePostCardsForGql } from './normalize-post-for-gql'

export async function getTagMetaContentApi({ slug }: { slug: string }) {
  const enc = encodeURIComponent(slug)
  const response = await sendContentApiRequest({
    path: `/v1/tags/by-slug/${enc}/meta`,
  })
  const parsed = V1TagBySlugMetaResponseSchema.safeParse(response)
  if (!parsed.success) {
    throw new Error('content-api schema mismatch tag meta')
  }
  const t = parsed.data
  return {
    ...t,
    ogTitle: t.ogTitle ?? undefined,
    ogDescription: t.ogDescription ?? undefined,
    ogImage: t.ogImage ?? undefined,
  }
}

export async function getTagPostsContentApi({
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
    path: `/v1/tags/by-slug/${enc}/posts`,
    query: { take, skip, orderBy: orderBy ?? 'publishedDate:desc' },
    traceHeaders,
  })
  const parsed = V1TagBySlugPostsResponseSchema.safeParse(response)
  if (!parsed.success) {
    throw new Error('content-api schema mismatch tag posts')
  }
  const t = parsed.data
  return {
    ...t,
    posts: normalizePostCardsForGql(t.posts),
  }
}
