import {
  CreatePostEssayAnswerLikeMutation,
  CreatePostEssayAnswerLikeMutationVariables,
  DeletePostEssayAnswerLikeMutation,
  DeletePostEssayAnswerLikeMutationVariables,
} from '__generated__/operations/post-essay-answer-like.generated'

import { sendGQLRequest } from '@/utils'

import {
  CREATE_POST_ESSAY_ANSWER_LIKE_MUTATION,
  DELETE_POST_ESSAY_ANSWER_LIKE_MUTATION,
} from './graphql/post-essay-answer-like'

export const createPostEssayAnswerLike = async (
  variables: CreatePostEssayAnswerLikeMutationVariables,
  accessToken: string
) => {
  const response = await sendGQLRequest<CreatePostEssayAnswerLikeMutation>(
    {
      query: CREATE_POST_ESSAY_ANSWER_LIKE_MUTATION,
      variables,
    },
    {
      authToken: accessToken,
    }
  )
  return response?.data?.data?.createPostEssayAnswerLike
}

export const deletePostEssayAnswerLike = async (
  variables: DeletePostEssayAnswerLikeMutationVariables,
  accessToken: string
) => {
  const response = await sendGQLRequest<DeletePostEssayAnswerLikeMutation>(
    {
      query: DELETE_POST_ESSAY_ANSWER_LIKE_MUTATION,
      variables,
    },
    {
      authToken: accessToken,
    }
  )
  return response?.data?.data?.deletePostEssayAnswerLike
}
