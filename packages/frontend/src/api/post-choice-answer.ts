import {
  CreatePostChoiceAnswerMutation,
  CreatePostChoiceAnswerMutationVariables,
  GetPostChoiceAnswersQuery,
  GetPostChoiceAnswersQueryVariables,
  UpdatePostChoiceAnswerMutation,
  UpdatePostChoiceAnswerMutationVariables,
} from '__generated__/operations/post-choice-answer.generated'

import { sendGQLRequest } from '@/utils/send-gql-request'

import {
  CREATE_POST_CHOICE_ANSWER_MUTATION,
  GET_POST_CHOICE_ANSWER_QUERY,
  UPDATE_POST_CHOICE_ANSWER_MUTATION,
} from './graphql/post-choice-answer'

export const getPostChoiceAnswersByMemberId = async (
  memberId: string,
  accessToken: string
) => {
  const variables: GetPostChoiceAnswersQueryVariables = {
    where: { member: { id: { equals: memberId } } },
  }

  const response = await sendGQLRequest<GetPostChoiceAnswersQuery>(
    {
      query: GET_POST_CHOICE_ANSWER_QUERY,
      variables,
    },
    {
      authToken: accessToken,
    }
  )
  return response?.data?.data?.postChoiceAnswers ?? []
}
export const createPostChoiceAnswer = async (
  variables: CreatePostChoiceAnswerMutationVariables,
  accessToken: string
) => {
  const response = await sendGQLRequest<CreatePostChoiceAnswerMutation>(
    {
      query: CREATE_POST_CHOICE_ANSWER_MUTATION,
      variables,
    },
    {
      authToken: accessToken,
    }
  )
  return response?.data?.data?.createPostChoiceAnswer
}

export const updatePostChoiceAnswer = async (
  variables: UpdatePostChoiceAnswerMutationVariables,
  accessToken: string
) => {
  const response = await sendGQLRequest<UpdatePostChoiceAnswerMutation>(
    {
      query: UPDATE_POST_CHOICE_ANSWER_MUTATION,
      variables,
    },
    {
      authToken: accessToken,
    }
  )
  return response?.data?.data?.updatePostChoiceAnswer
}
