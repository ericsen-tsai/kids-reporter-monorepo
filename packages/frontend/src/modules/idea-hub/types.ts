import { V1PostsEssayAnswersWithLikesResponseSchema } from '@kids-reporter/api-types'
import type { z } from 'zod'

import { RecursiveNonNullable } from '@/types/utils'

type PostsEssayAnswersWithLikes = z.infer<
  typeof V1PostsEssayAnswersWithLikesResponseSchema
>

export type PostWithTwoTopLikesAnswersPerQuestion = RecursiveNonNullable<{
  posts: PostsEssayAnswersWithLikes
}>
