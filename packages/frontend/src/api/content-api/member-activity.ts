import {
  V1EssayAnswersHasLikedResponseSchema,
  V1MemberPostsWithAnswersResponseSchema,
} from '@kids-reporter/api-types'

import { sendContentApiRequest } from '@/utils/send-content-api'

export async function getMemberPostsWithAnswersContentApi({
  accessToken,
  take,
  cursor,
}: {
  accessToken: string
  take?: number
  cursor?: string
}) {
  const response = (await sendContentApiRequest({
    path: '/v1/members/me/posts-with-answers',
    authToken: accessToken,
    query: { take, cursor },
  })) as unknown
  const parsed = V1MemberPostsWithAnswersResponseSchema.safeParse(response)
  if (!parsed.success) {
    throw new Error('content-api invalid posts-with-answers response')
  }
  return parsed.data
}

export async function getMemberEssayAnswersHasLikedContentApi({
  accessToken,
  essayAnswerIds,
}: {
  accessToken: string
  essayAnswerIds: string[]
}) {
  const response = (await sendContentApiRequest({
    path: '/v1/members/me/essay-answers/has-liked',
    method: 'GET',
    authToken: accessToken,
    query: {
      essayAnswerIds: essayAnswerIds.length ? essayAnswerIds.join(',') : '',
    },
  })) as unknown
  const parsed = V1EssayAnswersHasLikedResponseSchema.safeParse(response)
  if (!parsed.success) {
    throw new Error('content-api invalid has-liked response')
  }
  return parsed.data
}
