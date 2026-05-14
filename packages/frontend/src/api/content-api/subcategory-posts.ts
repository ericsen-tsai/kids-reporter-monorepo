import { V1SubcategoryBySlugPostsResponseSchema } from '@kids-reporter/api-types'

import {
  contentApiResponseParseError,
  sendContentApiRequest,
} from '@/utils/send-content-api'

import { normalizePostCardsForGql } from './normalize-post-for-gql'

export async function getSubcategoryPostsContentApi({
  slug,
  take,
  skip,
}: {
  slug: string
  take?: number
  skip?: number
}) {
  const enc = encodeURIComponent(slug)
  const response = await sendContentApiRequest({
    path: `/v1/subcategories/by-slug/${enc}/posts`,
    query: { take, skip },
  })
  const parsed = V1SubcategoryBySlugPostsResponseSchema.safeParse(response)
  if (!parsed.success) {
    throw contentApiResponseParseError(
      'content-api schema mismatch subcategory posts',
      parsed.error
    )
  }
  const s = parsed.data
  return {
    ...s,
    relatedPosts: normalizePostCardsForGql(s.relatedPosts),
  }
}
