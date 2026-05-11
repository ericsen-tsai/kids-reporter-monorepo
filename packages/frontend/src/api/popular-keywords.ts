import type { V1PopularKeywordsResponseSchema } from '@kids-reporter/api-types'
import type { z } from 'zod'

import { getPopularKeywordsContentApi } from '@/api/content-api/popular-keywords'

export const getPopularKeywords = async (
  traceHeaders?: Record<string, string>
): Promise<z.infer<typeof V1PopularKeywordsResponseSchema>> => {
  return await getPopularKeywordsContentApi({ traceHeaders })
}
