import {
  CreatePostEssayAnswerMutationVariables,
  UpdatePostEssayAnswerMutationVariables,
} from '__generated__/operations/post-essay-answer.generated'
import { useMutation, useQuery } from '@tanstack/react-query'

import {
  createPostEssayAnswer,
  getPostEssayAnswersByMemberId,
  updatePostEssayAnswer,
} from '@/api/post-essay-answer'

export const POST_ESSAY_ANSWERS_QUERY_KEY = 'post-essay-answers'

export function usePostEssayAnswersQuery({
  memberId,
  accessToken,
}: {
  memberId: string
  accessToken: string
}) {
  return useQuery({
    queryKey: [POST_ESSAY_ANSWERS_QUERY_KEY, memberId],
    queryFn: () => getPostEssayAnswersByMemberId(memberId, accessToken),
    enabled: !!memberId && !!accessToken,
    staleTime: Infinity,
  })
}

export function useCreatePostEssayAnswerMutation({
  accessToken,
}: {
  accessToken: string
}) {
  return useMutation({
    mutationFn: (variables: CreatePostEssayAnswerMutationVariables) =>
      createPostEssayAnswer(variables, accessToken),
  })
}

export function useUpdatePostEssayAnswerMutation({
  accessToken,
}: {
  accessToken: string
}) {
  return useMutation({
    mutationFn: (variables: UpdatePostEssayAnswerMutationVariables) =>
      updatePostEssayAnswer(variables, accessToken),
  })
}
