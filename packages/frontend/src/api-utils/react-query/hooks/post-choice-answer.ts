import {
  CreatePostChoiceAnswerMutationVariables,
  UpdatePostChoiceAnswerMutationVariables,
} from '__generated__/operations/post-choice-answer.generated'
import { useMutation, useQuery } from '@tanstack/react-query'

import {
  createPostChoiceAnswer,
  getPostChoiceAnswersByMemberId,
  updatePostChoiceAnswer,
} from '@/api/post-choice-answer'

export const POST_CHOICE_ANSWERS_QUERY_KEY = 'post-choice-answers'

export function usePostChoiceAnswersQuery({
  memberId,
  accessToken,
}: {
  memberId: string
  accessToken: string
}) {
  return useQuery({
    queryKey: [POST_CHOICE_ANSWERS_QUERY_KEY, memberId],
    queryFn: () => getPostChoiceAnswersByMemberId(memberId, accessToken),
    enabled: !!memberId && !!accessToken,
    staleTime: Infinity,
  })
}

export function useCreatePostChoiceAnswerMutation({
  accessToken,
}: {
  accessToken: string
}) {
  return useMutation({
    mutationFn: (variables: CreatePostChoiceAnswerMutationVariables) =>
      createPostChoiceAnswer(variables, accessToken),
  })
}

export function useUpdatePostChoiceAnswerMutation({
  accessToken,
}: {
  accessToken: string
}) {
  return useMutation({
    mutationFn: (variables: UpdatePostChoiceAnswerMutationVariables) =>
      updatePostChoiceAnswer(variables, accessToken),
  })
}
