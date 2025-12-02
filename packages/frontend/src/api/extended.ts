import { GetMemberPostsWithAnswersQueryVariables } from '__generated__/operations/extended.generated'

import { sendGQLRequest } from '@/utils/send-gql-request'

import {
  GET_MEMBER_ESSAY_ANSWERS_HAS_LIKED_GQL,
  GET_MEMBER_POSTS_WITH_ANSWERS_GQL,
} from './graphql/extended'

export type GetMemberPostsWithAnswersQuerySchema = {
  getMemberPostsWithAnswers: {
    posts: {
      id: string
      title: string
      slug: string
      publishedDate: string
      essayAnswers: {
        id: string
        content: string
        likesCount: number
        createdAt: string
        updatedAt: string
        question: {
          id: string
          title: string
          hint: string | null
          post: {
            id: string
          }
        }
      }[]
      choiceAnswers: {
        id: string
        choiceIndex: number
        correct: boolean
        createdAt: string
        updatedAt: string
        question: {
          id: string
          title: string
          options: { content: string; isCorrectAnswer: boolean }[]
          reason: string | null
          post: {
            id: string
          }
        }
      }[]
      lastAnsweredTime: string
    }[]
    nextCursor: string | null
  }
}

export const getMemberPostsWithAnswers = async (
  variables: GetMemberPostsWithAnswersQueryVariables & { accessToken: string }
) => {
  const response = await sendGQLRequest<GetMemberPostsWithAnswersQuerySchema>(
    {
      query: GET_MEMBER_POSTS_WITH_ANSWERS_GQL,
      variables,
    },
    {
      authToken: variables.accessToken,
    }
  )
  return response?.data?.data?.getMemberPostsWithAnswers
}

export const getMemberEssayAnswersHasLiked = async (
  variables: {
    memberId: string
    answerIds: string[]
  } & {
    accessToken: string
  }
) => {
  const response = await sendGQLRequest<{
    getMemberEssayAnswersHasLiked: {
      answerId: string
      hasLiked: boolean
    }[]
  }>({
    query: GET_MEMBER_ESSAY_ANSWERS_HAS_LIKED_GQL,
    variables,
  })
  return response?.data?.data?.getMemberEssayAnswersHasLiked
}
