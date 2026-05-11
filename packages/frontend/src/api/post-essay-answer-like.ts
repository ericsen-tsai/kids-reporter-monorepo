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
  accessToken: string
) => {
  return await createPostEssayAnswerLikeContentApi(body, accessToken)
}

export const deletePostEssayAnswerLike = async (
  params: z.infer<typeof V1PostEssayAnswerLikePathIdSchema>,
  accessToken: string
) => {
  return await deletePostEssayAnswerLikeContentApi(params, accessToken)
}
