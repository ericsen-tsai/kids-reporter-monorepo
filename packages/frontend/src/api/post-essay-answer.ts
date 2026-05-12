import type {
  V1AllPostEssayAnswersQuerySchema,
  V1CreatePostEssayAnswerBodySchema,
  V1PatchPostEssayAnswerBodySchema,
} from '@kids-reporter/api-types'
import type { z } from 'zod'

import {
  createPostEssayAnswerContentApi,
  getAllPostEssayAnswersContentApi,
  getPostEssayAnswersByMemberIdContentApi,
  updatePostEssayAnswerContentApi,
} from '@/api/content-api/post-qna'

export const getPostEssayAnswersByMemberId = async (
  accessToken: string,
  postSlug?: string,
  traceHeaders?: Record<string, string>
) => {
  return await getPostEssayAnswersByMemberIdContentApi({
    accessToken,
    postSlug,
    traceHeaders,
  })
}

export const getAllPostEssayAnswers = async (
  query?: z.infer<typeof V1AllPostEssayAnswersQuerySchema>,
  traceHeaders?: Record<string, string>
) => {
  return await getAllPostEssayAnswersContentApi(
    {
      take: query?.take ?? 10,
      orderBy: 'createdAt:desc',
    },
    traceHeaders
  )
}

export const createPostEssayAnswer = async (
  body: z.infer<typeof V1CreatePostEssayAnswerBodySchema>,
  accessToken: string,
  traceHeaders?: Record<string, string>
) => {
  return await createPostEssayAnswerContentApi(body, accessToken, traceHeaders)
}

export const updatePostEssayAnswer = async (
  {
    id,
    patch,
  }: {
    id: number | string
    patch: z.infer<typeof V1PatchPostEssayAnswerBodySchema>
  },
  accessToken: string,
  traceHeaders?: Record<string, string>
) => {
  return await updatePostEssayAnswerContentApi(
    { id, patch },
    accessToken,
    traceHeaders
  )
}
