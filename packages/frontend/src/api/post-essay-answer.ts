import {
  CreatePostEssayAnswerMutation,
  CreatePostEssayAnswerMutationVariables,
  GetAllPostEssayAnswersQuery,
  GetAllPostEssayAnswersQueryVariables,
  GetPostEssayAnswersQuery,
  GetPostEssayAnswersQueryVariables,
  UpdatePostEssayAnswerMutation,
  UpdatePostEssayAnswerMutationVariables,
} from '__generated__/operations/post-essay-answer.generated'
import { PostEssayAnswerOrderByInput } from '__generated__/types'

import { sendGQLRequest } from '@/utils/send-gql-request'

import {
  CREATE_POST_ESSAY_ANSWER_MUTATION,
  GET_ALL_POST_ESSAY_ANSWERS_QUERY,
  GET_POST_ESSAY_ANSWER_QUERY,
  UPDATE_POST_ESSAY_ANSWER_MUTATION,
} from './graphql/post-essay-answer'

export const getPostEssayAnswersByMemberId = async (
  memberId: string,
  accessToken: string,
  postSlug?: string
) => {
  const variables: GetPostEssayAnswersQueryVariables = {
    where: {
      member: { id: { equals: memberId } },
      ...(postSlug && { question: { post: { slug: { equals: postSlug } } } }),
    },
  }
  const response = await sendGQLRequest<GetPostEssayAnswersQuery>(
    {
      query: GET_POST_ESSAY_ANSWER_QUERY,
      variables,
    },
    {
      authToken: accessToken,
    }
  )
  return response?.data?.data?.postEssayAnswers ?? []
}

export const getAllPostEssayAnswers = async (
  orderBy?: PostEssayAnswerOrderByInput[],
  take?: number
) => {
  const variables: GetAllPostEssayAnswersQueryVariables = {
    orderBy: orderBy ?? [],
    take: take ?? 10,
  }
  const response = await sendGQLRequest<GetAllPostEssayAnswersQuery>({
    query: GET_ALL_POST_ESSAY_ANSWERS_QUERY,
    variables,
  })
  return response?.data?.data?.postEssayAnswers ?? []
}

export const createPostEssayAnswer = async (
  variables: CreatePostEssayAnswerMutationVariables,
  accessToken: string
) => {
  const response = await sendGQLRequest<CreatePostEssayAnswerMutation>(
    {
      query: CREATE_POST_ESSAY_ANSWER_MUTATION,
      variables,
    },
    {
      authToken: accessToken,
    }
  )
  return response?.data?.data?.createPostEssayAnswer
}

export const updatePostEssayAnswer = async (
  variables: UpdatePostEssayAnswerMutationVariables,
  accessToken: string
) => {
  const response = await sendGQLRequest<UpdatePostEssayAnswerMutation>(
    {
      query: UPDATE_POST_ESSAY_ANSWER_MUTATION,
      variables,
    },
    {
      authToken: accessToken,
    }
  )

  return response?.data?.data?.updatePostEssayAnswer
}
