import { V1SubcategoriesResponseSchema } from '@kids-reporter/api-types'

import { sendContentApiRequest } from '@/utils/send-content-api'

export async function getSubcategoriesContentApi({
  traceHeaders,
}: {
  traceHeaders?: Record<string, string>
} = {}) {
  const response = await sendContentApiRequest({
    path: '/v1/subcategories',
    method: 'GET',
    traceHeaders,
  })
  const parsed = V1SubcategoriesResponseSchema.safeParse(response)
  if (!parsed.success) {
    throw new Error(
      'content-api response schema mismatch for /v1/subcategories'
    )
  }
  return parsed.data.map((s) => ({
    ...s,
    id: String(s.id),
  }))
}
