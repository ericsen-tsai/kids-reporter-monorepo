import { V1AuthorAvatarResponseSchema } from '@kids-reporter/api-types'

import { sendContentApiRequest } from '@/utils/send-content-api'

export async function getAuthorAvatarBySlugContentApi({
  slug,
  traceHeaders,
}: {
  slug: string
  traceHeaders?: Record<string, string>
}) {
  const encoded = encodeURIComponent(slug)
  const response = await sendContentApiRequest({
    path: `/v1/authors/by-slug/${encoded}/avatar`,
    method: 'GET',
    traceHeaders,
  })
  const parsed = V1AuthorAvatarResponseSchema.safeParse(response)
  if (!parsed.success) {
    throw new Error(
      'content-api response schema mismatch for /v1/authors/by-slug/:slug/avatar'
    )
  }
  return parsed.data.tiny
}
