import {
  V1SitemapPostsResponseSchema,
  V1SitemapProjectsResponseSchema,
} from '@kids-reporter/api-types'

import {
  contentApiResponseParseError,
  sendContentApiRequest,
} from '@/utils/send-content-api'

export async function getSitemapPostsContentApi({
  sinceDays,
}: {
  sinceDays?: number
}) {
  const response = await sendContentApiRequest({
    path: '/v1/sitemaps/posts',
    method: 'GET',
    query: { sinceDays },
  })
  const parsed = V1SitemapPostsResponseSchema.safeParse(response)
  if (!parsed.success) {
    throw contentApiResponseParseError(
      'content-api response schema mismatch for /v1/sitemaps/posts',
      parsed.error
    )
  }
  return parsed.data
}

export async function getSitemapProjectsContentApi({
  sinceDays,
}: {
  sinceDays?: number
}) {
  const response = await sendContentApiRequest({
    path: '/v1/sitemaps/projects',
    method: 'GET',
    query: { sinceDays },
  })
  const parsed = V1SitemapProjectsResponseSchema.safeParse(response)
  if (!parsed.success) {
    throw contentApiResponseParseError(
      'content-api response schema mismatch for /v1/sitemaps/projects',
      parsed.error
    )
  }
  return parsed.data
}
