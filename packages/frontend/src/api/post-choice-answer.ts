import type {
  V1CreatePostChoiceAnswerBodySchema,
  V1PatchPostChoiceAnswerBodySchema,
} from '@kids-reporter/api-types'
import type { z } from 'zod'

import {
  createPostChoiceAnswerContentApi,
  getPostChoiceAnswersByMemberIdContentApi,
  updatePostChoiceAnswerContentApi,
} from '@/api/content-api/post-qna'

export const getPostChoiceAnswersByMemberId = async (
  memberId: string,
  accessToken: string,
  postSlug?: string
) => {
  void memberId
  return await getPostChoiceAnswersByMemberIdContentApi({
    accessToken,
    postSlug,
  })
}
export const createPostChoiceAnswer = async (
  body: z.infer<typeof V1CreatePostChoiceAnswerBodySchema>,
  accessToken: string
) => {
  return await createPostChoiceAnswerContentApi(body, accessToken)
}

export const updatePostChoiceAnswer = async (
  {
    id,
    patch,
  }: {
    id: number | string
    patch: z.infer<typeof V1PatchPostChoiceAnswerBodySchema>
  },
  accessToken: string
) => {
  return await updatePostChoiceAnswerContentApi({ id, patch }, accessToken)
}
