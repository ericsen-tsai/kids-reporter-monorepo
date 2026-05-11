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
  memberId: string,
  accessToken: string,
  postSlug?: string
) => {
  void memberId
  return await getPostEssayAnswersByMemberIdContentApi({
    accessToken,
    postSlug,
  })
}

export const getAllPostEssayAnswers = async (
  query?: z.infer<typeof V1AllPostEssayAnswersQuerySchema>
) => {
  return await getAllPostEssayAnswersContentApi({
    take: query?.take ?? 10,
    orderBy: 'createdAt:desc',
  })
}

export const createPostEssayAnswer = async (
  body: z.infer<typeof V1CreatePostEssayAnswerBodySchema>,
  accessToken: string
) => {
  return await createPostEssayAnswerContentApi(body, accessToken)
}

export const updatePostEssayAnswer = async (
  {
    id,
    patch,
  }: {
    id: number | string
    patch: z.infer<typeof V1PatchPostEssayAnswerBodySchema>
  },
  accessToken: string
) => {
  return await updatePostEssayAnswerContentApi({ id, patch }, accessToken)
}
