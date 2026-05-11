import type {
  EssayAnswerOrderByFlatSchema,
  V1AllPostEssayAnswersQuerySchema,
  V1AllPostEssayAnswersResponseSchema,
  V1CreatePostChoiceAnswerBodySchema,
  V1CreatePostChoiceAnswerResponseSchema,
  V1CreatePostEssayAnswerBodySchema,
  V1CreatePostEssayAnswerLikeBodySchema,
  V1CreatePostEssayAnswerLikeResponseSchema,
  V1CreatePostEssayAnswerResponseSchema,
  V1DeletePostEssayAnswerLikeResponseSchema,
  V1MemberPostChoiceAnswersResponseSchema,
  V1MemberPostEssayAnswersResponseSchema,
  V1PatchPostChoiceAnswerBodySchema,
  V1PatchPostEssayAnswerBodySchema,
  V1PostEssayAnswerLikePathIdSchema,
  V1PostEssayQuestionWithAnswersResponseSchema,
  V1UpdatePostChoiceAnswerResponseSchema,
  V1UpdatePostEssayAnswerResponseSchema,
} from '@kids-reporter/api-types'
import type { z } from 'zod'

import {
  ContentApiRequestError,
  sendContentApiRequest,
} from '@/utils/send-content-api'

export type EssayAnswerOrderByFlat = z.infer<
  typeof EssayAnswerOrderByFlatSchema
>

export async function getPostChoiceAnswersByMemberIdContentApi({
  accessToken,
  postSlug,
}: {
  accessToken: string
  postSlug?: string
}) {
  const body = await sendContentApiRequest<
    z.infer<typeof V1MemberPostChoiceAnswersResponseSchema>
  >({
    path: '/v1/members/me/post-choice-answers',
    authToken: accessToken,
    query: { postSlug: postSlug ?? undefined },
  })
  if (!Array.isArray(body)) {
    throw new Error('content-api: expected array for post-choice-answers')
  }
  return body
}

export async function createPostChoiceAnswerContentApi(
  body: z.infer<typeof V1CreatePostChoiceAnswerBodySchema>,
  accessToken: string
) {
  const out = await sendContentApiRequest<
    z.infer<typeof V1CreatePostChoiceAnswerResponseSchema>
  >({
    path: '/v1/members/me/post-choice-answers',
    method: 'POST',
    authToken: accessToken,
    body,
  })
  return out
}

export async function updatePostChoiceAnswerContentApi(
  {
    id,
    patch,
  }: {
    id: number | string
    patch: z.infer<typeof V1PatchPostChoiceAnswerBodySchema>
  },
  accessToken: string
) {
  const out = await sendContentApiRequest<
    z.infer<typeof V1UpdatePostChoiceAnswerResponseSchema>
  >({
    path: `/v1/members/me/post-choice-answers/${encodeURIComponent(String(id))}`,
    method: 'PATCH',
    authToken: accessToken,
    body: patch,
  })
  return out
}

export async function getPostEssayAnswersByMemberIdContentApi({
  accessToken,
  postSlug,
}: {
  accessToken: string
  postSlug?: string
}) {
  const body = await sendContentApiRequest<
    z.infer<typeof V1MemberPostEssayAnswersResponseSchema>
  >({
    path: '/v1/members/me/post-essay-answers',
    authToken: accessToken,
    query: { postSlug: postSlug ?? undefined },
  })
  if (!Array.isArray(body)) {
    throw new Error('content-api: expected array for post-essay-answers')
  }
  return body
}

export async function getAllPostEssayAnswersContentApi(
  query: z.infer<typeof V1AllPostEssayAnswersQuerySchema>
) {
  const body = await sendContentApiRequest<
    z.infer<typeof V1AllPostEssayAnswersResponseSchema>
  >({
    path: '/v1/post-essay-answers',
    query: {
      take: query.take ?? undefined,
      orderBy: 'createdAt:desc',
    },
  })
  if (!Array.isArray(body)) {
    throw new Error('content-api: expected array for all post-essay-answers')
  }
  return body
}

export async function createPostEssayAnswerContentApi(
  body: z.infer<typeof V1CreatePostEssayAnswerBodySchema>,
  accessToken: string
) {
  const out = await sendContentApiRequest<
    z.infer<typeof V1CreatePostEssayAnswerResponseSchema>
  >({
    path: '/v1/members/me/post-essay-answers',
    method: 'POST',
    authToken: accessToken,
    body,
  })
  return out
}

export async function updatePostEssayAnswerContentApi(
  {
    id,
    patch,
  }: {
    id: number | string
    patch: z.infer<typeof V1PatchPostEssayAnswerBodySchema>
  },
  accessToken: string
) {
  const out = await sendContentApiRequest<
    z.infer<typeof V1UpdatePostEssayAnswerResponseSchema>
  >({
    path: `/v1/members/me/post-essay-answers/${encodeURIComponent(String(id))}`,
    method: 'PATCH',
    authToken: accessToken,
    body: patch,
  })
  return out
}

export async function getPostEssayQuestionEssayAnswersContentApi({
  questionId,
  answerOrderBy,
  answerTake,
  answerSkip,
}: {
  questionId: number
  answerOrderBy: EssayAnswerOrderByFlat
  answerTake: number
  answerSkip?: number
}) {
  try {
    const body = await sendContentApiRequest<
      z.infer<typeof V1PostEssayQuestionWithAnswersResponseSchema>
    >({
      path: `/v1/post-essay-questions/${questionId}`,
      query: {
        answerTake,
        answerSkip: answerSkip ?? undefined,
        answerOrderBy,
      },
    })
    return body.answers ?? []
  } catch (e) {
    if (e instanceof ContentApiRequestError && e.status === 404) {
      return []
    }
    throw e
  }
}

export async function createPostEssayAnswerLikeContentApi(
  body: z.infer<typeof V1CreatePostEssayAnswerLikeBodySchema>,
  accessToken: string
) {
  const out = await sendContentApiRequest<
    z.infer<typeof V1CreatePostEssayAnswerLikeResponseSchema>
  >({
    path: '/v1/members/me/post-essay-answer-likes',
    method: 'POST',
    authToken: accessToken,
    body,
  })
  return out
}

export async function deletePostEssayAnswerLikeContentApi(
  params: z.infer<typeof V1PostEssayAnswerLikePathIdSchema>,
  accessToken: string
) {
  const out = await sendContentApiRequest<
    z.infer<typeof V1DeletePostEssayAnswerLikeResponseSchema>
  >({
    path: `/v1/members/me/post-essay-answer-likes/${encodeURIComponent(
      String(params.id)
    )}`,
    method: 'DELETE',
    authToken: accessToken,
  })
  return out
}
