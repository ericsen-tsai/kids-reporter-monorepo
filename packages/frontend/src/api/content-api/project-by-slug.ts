import {
  V1ProjectBySlugDetailResponseSchema,
  V1ProjectBySlugMetaResponseSchema,
  V1ProjectRelatedPostsCountResponseSchema,
} from '@kids-reporter/api-types'
import type { z } from 'zod'

import {
  ContentApiRequestError,
  sendContentApiRequest,
} from '@/utils/send-content-api'

export async function getProjectMetaContentApi({
  slug,
  traceHeaders,
}: {
  slug: string
  traceHeaders?: Headers | Record<string, string | undefined>
}): Promise<z.infer<typeof V1ProjectBySlugMetaResponseSchema> | undefined> {
  try {
    const response = await sendContentApiRequest({
      path: `/v1/projects/by-slug/${encodeURIComponent(slug)}/meta`,
      method: 'GET',
      traceHeaders,
    })
    const parsed = V1ProjectBySlugMetaResponseSchema.safeParse(response)
    if (!parsed.success) {
      throw new Error('content-api schema mismatch project meta')
    }
    return parsed.data
  } catch (e) {
    if (e instanceof ContentApiRequestError && e.status === 404) {
      return undefined
    }
    throw e
  }
}

export async function getProjectDetailContentApi({
  slug,
  traceHeaders,
}: {
  slug: string
  traceHeaders?: Headers | Record<string, string | undefined>
}): Promise<z.infer<typeof V1ProjectBySlugDetailResponseSchema> | undefined> {
  try {
    const response = await sendContentApiRequest({
      path: `/v1/projects/by-slug/${encodeURIComponent(slug)}`,
      method: 'GET',
      traceHeaders,
    })
    const parsed = V1ProjectBySlugDetailResponseSchema.safeParse(response)
    if (!parsed.success) {
      throw new Error('content-api schema mismatch project detail')
    }
    return parsed.data
  } catch (e) {
    if (e instanceof ContentApiRequestError && e.status === 404) {
      return undefined
    }
    throw e
  }
}

export async function getProjectRelatedPostsCountContentApi({
  slug,
  traceHeaders,
}: {
  slug: string
  traceHeaders?: Headers | Record<string, string | undefined>
}): Promise<
  z.infer<typeof V1ProjectRelatedPostsCountResponseSchema> | undefined
> {
  try {
    const response = await sendContentApiRequest({
      path: `/v1/projects/by-slug/${encodeURIComponent(slug)}/related-posts-count`,
      method: 'GET',
      traceHeaders,
    })
    const parsed = V1ProjectRelatedPostsCountResponseSchema.safeParse(response)
    if (!parsed.success) {
      throw new Error('content-api schema mismatch project related-posts-count')
    }
    return parsed.data
  } catch (e) {
    if (e instanceof ContentApiRequestError && e.status === 404) {
      return undefined
    }
    throw e
  }
}
