import type {
  V1AllPostEssayAnswersQuerySchema,
  V1CreatePostEssayAnswerBodySchema,
  V1PatchPostEssayAnswerBodySchema,
} from '@kids-reporter/api-types'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { z } from 'zod'

import {
  createPostEssayAnswer,
  getAllPostEssayAnswers,
  getPostEssayAnswersByMemberId,
  updatePostEssayAnswer,
} from '@/api/post-essay-answer'

const POST_ESSAY_ANSWERS_QUERY_KEY = 'post-essay-answers'

export function usePostEssayAnswersQuery({
  memberId,
  accessToken,
  postSlug,
}: {
  memberId: string
  accessToken: string
  postSlug?: string
}) {
  return useQuery({
    queryKey: usePostEssayAnswersQuery.getQueryKey({ memberId, postSlug }),
    queryFn: () =>
      getPostEssayAnswersByMemberId(memberId, accessToken, postSlug),
    enabled: !!memberId && !!accessToken,
    staleTime: Infinity,
  })
}
usePostEssayAnswersQuery.getQueryKey = ({
  memberId,
  postSlug,
}: {
  memberId: string
  postSlug?: string
}) => [POST_ESSAY_ANSWERS_QUERY_KEY, memberId, postSlug ?? 'all-posts']

export function useAllPostEssayAnswersQuery({ take }: { take?: number }) {
  return useQuery({
    queryKey: useAllPostEssayAnswersQuery.getQueryKey({ take }),
    queryFn: () =>
      getAllPostEssayAnswers({
        take: take ?? 10,
        orderBy: 'createdAt:desc',
      } as z.infer<typeof V1AllPostEssayAnswersQuerySchema>),
    staleTime: Infinity,
  })
}

useAllPostEssayAnswersQuery.getQueryKey = ({ take }: { take?: number }) => [
  POST_ESSAY_ANSWERS_QUERY_KEY,
  'all-members',
  'all-posts',
  ...(take ? [take] : []),
]

export function useCreatePostEssayAnswerMutation({
  accessToken,
}: {
  accessToken: string
}) {
  return useMutation({
    mutationFn: (body: z.infer<typeof V1CreatePostEssayAnswerBodySchema>) =>
      createPostEssayAnswer(body, accessToken),
  })
}

export function useUpdatePostEssayAnswerMutation({
  accessToken,
}: {
  accessToken: string
}) {
  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: number | string
      patch: z.infer<typeof V1PatchPostEssayAnswerBodySchema>
    }) => updatePostEssayAnswer({ id, patch }, accessToken),
  })
}
