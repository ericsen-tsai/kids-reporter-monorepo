import { V1ProjectsResponseSchema } from '@kids-reporter/api-types'

import { sendContentApiRequest } from '@/utils/send-content-api'

export async function getTopicProjectsContentApi({
  take,
  traceHeaders,
}: {
  take?: number
  traceHeaders?: Record<string, string>
}) {
  const response = await sendContentApiRequest({
    path: '/v1/projects',
    method: 'GET',
    query: {
      take,
      orderBy: 'publishedDate:desc',
    },
    traceHeaders,
  })

  const parsed = V1ProjectsResponseSchema.safeParse(response)
  if (!parsed.success) {
    throw new Error(
      'content-api response schema mismatch for /v1/projects (topic list)'
    )
  }
  return parsed.data.projects
}
