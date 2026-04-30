import { V1ProjectsListResponseSchema } from '@kids-reporter/api-types'

import { sendContentApiRequest } from '@/utils/send-content-api'

export async function getProjectsListContentApi({
  take,
  skip,
  includeRelatedPosts,
  traceHeaders,
}: {
  take?: number
  skip?: number
  includeRelatedPosts?: boolean
  traceHeaders?: Record<string, string>
}) {
  const response = await sendContentApiRequest({
    path: '/v1/projects',
    method: 'GET',
    query: {
      take,
      skip,
      ...(includeRelatedPosts !== undefined
        ? {
            includeRelatedPosts: includeRelatedPosts
              ? 'true'
              : ('false' as const),
          }
        : {}),
      orderBy: 'publishedDate:desc',
    },
    traceHeaders,
  })

  const parsed = V1ProjectsListResponseSchema.safeParse(response)
  if (!parsed.success) {
    throw new Error('content-api response schema mismatch for /v1/projects')
  }
  return parsed.data
}
