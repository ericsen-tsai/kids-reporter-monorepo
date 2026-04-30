import { V1TopicProjectsResponseSchema } from '@kids-reporter/api-types'

import { sendContentApiRequest } from '@/utils/send-content-api'

export async function getTopicProjectsContentApi({
  take,
  traceHeaders,
}: {
  take?: number
  traceHeaders?: Record<string, string>
}) {
  const response = await sendContentApiRequest({
    path: '/v1/projects/topics',
    method: 'GET',
    query: {
      take,
      orderBy: 'publishedDate:desc',
    },
    traceHeaders,
  })

  const parsed = V1TopicProjectsResponseSchema.safeParse(response)
  if (!parsed.success) {
    throw new Error(
      'content-api response schema mismatch for /v1/projects/topics'
    )
  }
  return parsed.data.projects
}
