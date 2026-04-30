import {
  GetMemberEssayAnswersHasLikedQuery,
  GetMemberEssayAnswersHasLikedQueryVariables,
  GetMemberPostsWithAnswersQueryVariables,
} from '__generated__/operations/members.generated'

import {
  getMemberEssayAnswersHasLikedContentApi,
  getMemberPostsWithAnswersContentApi,
} from '@/api/content-api/member-activity'
import type { GetMemberPostsWithAnswersQuerySchema } from '@/api/member-posts-with-answers-schema'
import envVars from '@/environment-variables'
import { logContentApiFallback } from '@/utils/log-content-api-fallback'
import { sendRestGqlRequest } from '@/utils/send-rest-gql'

export type { GetMemberPostsWithAnswersQuerySchema } from '@/api/member-posts-with-answers-schema'

export const getMemberPostsWithAnswers = async (
  variables: GetMemberPostsWithAnswersQueryVariables & { accessToken: string }
) => {
  const { accessToken, ...restVariables } = variables
  if (envVars.useContentApi) {
    try {
      return await getMemberPostsWithAnswersContentApi({
        accessToken,
        take: restVariables.take ?? undefined,
        cursor: restVariables.nextCursor ?? undefined,
      })
    } catch (err) {
      logContentApiFallback('getMemberPostsWithAnswers', err)
    }
  }
  const response =
    await sendRestGqlRequest<GetMemberPostsWithAnswersQuerySchema>({
      operation: 'member-posts-with-answers',
      method: 'GET',
      variables: restVariables,
      authToken: accessToken,
    })
  return response?.data?.data?.getMemberPostsWithAnswers
}

export const getMemberEssayAnswersHasLiked = async (
  variables: GetMemberEssayAnswersHasLikedQueryVariables & {
    accessToken: string
  }
) => {
  const { accessToken, ...restVariables } = variables
  if (envVars.useContentApi) {
    try {
      const rawIds = restVariables.essayAnswerIds
      const essayAnswerIds = Array.isArray(rawIds)
        ? rawIds
        : rawIds != null
          ? [rawIds]
          : []
      return await getMemberEssayAnswersHasLikedContentApi({
        accessToken,
        essayAnswerIds,
      })
    } catch (err) {
      logContentApiFallback('getMemberEssayAnswersHasLiked', err)
    }
  }
  const response = await sendRestGqlRequest<GetMemberEssayAnswersHasLikedQuery>(
    {
      operation: 'member-essay-answers-has-liked',
      method: 'GET',
      variables: restVariables,
      authToken: accessToken,
    }
  )
  return response?.data?.data?.getMemberEssayAnswersHasLiked
}
