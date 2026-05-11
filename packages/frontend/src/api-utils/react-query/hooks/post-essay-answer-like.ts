import type {
  V1CreatePostEssayAnswerLikeBodySchema,
  V1PostEssayAnswerLikePathIdSchema,
} from '@kids-reporter/api-types'
import { useMutation } from '@tanstack/react-query'
import type { z } from 'zod'

import {
  createPostEssayAnswerLike,
  deletePostEssayAnswerLike,
} from '@/api/post-essay-answer-like'

export function useCreatePostEssayAnswerLikeMutation({
  accessToken,
}: {
  accessToken: string
}) {
  return useMutation({
    mutationFn: (body: z.infer<typeof V1CreatePostEssayAnswerLikeBodySchema>) =>
      createPostEssayAnswerLike(body, accessToken),
  })
}

export function useDeletePostEssayAnswerLikeMutation({
  accessToken,
}: {
  accessToken: string
}) {
  return useMutation({
    mutationFn: (params: z.infer<typeof V1PostEssayAnswerLikePathIdSchema>) =>
      deletePostEssayAnswerLike(params, accessToken),
  })
}
