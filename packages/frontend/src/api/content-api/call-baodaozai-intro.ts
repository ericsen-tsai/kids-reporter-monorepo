import { V1CallBaodaozaiIntroResponseSchema } from '@kids-reporter/api-types'

import { sendContentApiRequest } from '@/utils/send-content-api'

export async function getCallBaodaozaiIntroContentApi({
  page,
  traceHeaders,
}: {
  page: string
  traceHeaders?: Record<string, string>
}) {
  const response = await sendContentApiRequest({
    path: `/v1/call-baodaozai-intros/${encodeURIComponent(page)}`,
    method: 'GET',
    traceHeaders,
  })
  const parsed = V1CallBaodaozaiIntroResponseSchema.safeParse(response)
  if (!parsed.success) {
    throw new Error(
      'content-api response schema mismatch for /v1/call-baodaozai-intros/:page'
    )
  }
  return parsed.data.content
}
