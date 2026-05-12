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
  accessToken: string,
  postSlug?: string,
  traceHeaders?: Record<string, string>
) => {
  return await getPostChoiceAnswersByMemberIdContentApi({
    accessToken,
    postSlug,
    traceHeaders,
  })
}

export const createPostChoiceAnswer = async (
  body: z.infer<typeof V1CreatePostChoiceAnswerBodySchema>,
  accessToken: string,
  traceHeaders?: Record<string, string>
) => {
  return await createPostChoiceAnswerContentApi(body, accessToken, traceHeaders)
}

export const updatePostChoiceAnswer = async (
  {
    id,
    patch,
  }: {
    id: number | string
    patch: z.infer<typeof V1PatchPostChoiceAnswerBodySchema>
  },
  accessToken: string,
  traceHeaders?: Record<string, string>
) => {
  return await updatePostChoiceAnswerContentApi(
    { id, patch },
    accessToken,
    traceHeaders
  )
}
