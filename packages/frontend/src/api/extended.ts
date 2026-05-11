import {
  getMemberEssayAnswersHasLikedContentApi,
  getMemberPostsWithAnswersContentApi,
} from '@/api/content-api/member-activity'

export const getMemberPostsWithAnswers = async (variables: {
  accessToken: string
  take?: number
  nextCursor?: string | null
}) => {
  const { accessToken, ...restVariables } = variables
  return await getMemberPostsWithAnswersContentApi({
    accessToken,
    take: restVariables.take ?? undefined,
    cursor: restVariables.nextCursor ?? undefined,
  })
}

export const getMemberEssayAnswersHasLiked = async (variables: {
  accessToken: string
  essayAnswerIds: string[]
}) => {
  const { accessToken, ...restVariables } = variables
  return await getMemberEssayAnswersHasLikedContentApi({
    accessToken,
    essayAnswerIds: restVariables.essayAnswerIds,
  })
}
