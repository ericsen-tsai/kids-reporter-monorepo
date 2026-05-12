import type {
  V1CreatePostEssayAnswerLikeBodySchema,
  V1PostEssayAnswerLikePathIdSchema,
} from '@kids-reporter/api-types'
import type { z } from 'zod'

import {
  createPostEssayAnswerLikeContentApi,
  deletePostEssayAnswerLikeContentApi,
} from '@/api/content-api/post-qna'

export const createPostEssayAnswerLike = async (
  body: z.infer<typeof V1CreatePostEssayAnswerLikeBodySchema>,
  accessToken: string,
  traceHeaders?: Record<string, string>
) => {
  return await createPostEssayAnswerLikeContentApi(
    body,
    accessToken,
    traceHeaders
  )
}

export const deletePostEssayAnswerLike = async (
  params: z.infer<typeof V1PostEssayAnswerLikePathIdSchema>,
  accessToken: string,
  traceHeaders?: Record<string, string>
) => {
  return await deletePostEssayAnswerLikeContentApi(
    params,
    accessToken,
    traceHeaders
  )
}
