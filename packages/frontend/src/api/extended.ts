import {
  getMemberEssayAnswersHasLikedContentApi,
  getMemberPostsWithAnswersContentApi,
} from '@/api/content-api/member-activity'

export const getMemberPostsWithAnswers = async (variables: {
  accessToken: string
  take?: number
  nextCursor?: string | null
  traceHeaders?: Record<string, string>
}) => {
  const { accessToken, traceHeaders, ...restVariables } = variables
  return await getMemberPostsWithAnswersContentApi({
    accessToken,
    take: restVariables.take ?? undefined,
    cursor: restVariables.nextCursor ?? undefined,
    traceHeaders,
  })
}

export const getMemberEssayAnswersHasLiked = async (variables: {
  accessToken: string
  essayAnswerIds: string[]
  traceHeaders?: Record<string, string>
}) => {
  const { accessToken, traceHeaders, ...restVariables } = variables
  return await getMemberEssayAnswersHasLikedContentApi({
    accessToken,
    essayAnswerIds: restVariables.essayAnswerIds,
    traceHeaders,
  })
}
