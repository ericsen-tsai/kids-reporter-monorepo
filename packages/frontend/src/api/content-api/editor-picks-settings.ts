import { V1EditorPicksSettingsResponseSchema } from '@kids-reporter/api-types'

import { sendContentApiRequest } from '@/utils/send-content-api'

export async function getEditorPicksSettingsContentApi({
  take,
  traceHeaders,
}: {
  take?: number
  traceHeaders?: Record<string, string>
}) {
  const response = await sendContentApiRequest({
    path: '/v1/editor-picks-settings',
    method: 'GET',
    query: { take },
    traceHeaders,
  })
  const parsed = V1EditorPicksSettingsResponseSchema.safeParse(response)
  if (!parsed.success) {
    throw new Error(
      'content-api response schema mismatch for /v1/editor-picks-settings'
    )
  }
  return parsed.data
}
