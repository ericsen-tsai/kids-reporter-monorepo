import type { MemberPostsWithAnswersPayload } from '@/api/member-posts-with-answers-schema'
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
  })) as MemberPostsWithAnswersPayload | null
  if (!response || !Array.isArray(response.posts)) {
    throw new Error('content-api invalid posts-with-answers response')
  }
  return response
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
  })) as Array<{
    essayAnswerId: string
    hasLiked: boolean
    essayAnswerLikeId: string
  }>
  if (!Array.isArray(response)) {
    throw new Error('content-api invalid has-liked response')
  }
  return response
}
