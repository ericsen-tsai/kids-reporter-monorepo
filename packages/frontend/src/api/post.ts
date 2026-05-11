import type {
  PostContent,
  V1PostDetailBodySchema,
  V1PostEssayQuestionsBodySchema,
  V1PostMetaBodySchema,
  V1PostsEssayAnswersWithLikesQuerySchema,
  V1PostsEssayAnswersWithLikesResponseSchema,
  V1PostsQuerySchema,
} from '@kids-reporter/api-types'
import type { z } from 'zod'

import {
  getLatestPostsContentApi,
  getPostContentApi,
  getPostEssayQuestionsByPostSlugContentApi,
  getPostMetaContentApi,
  getPostsEssayAnswersWithLikesContentApi,
  getPostsPagedContentApi,
} from '@/api/content-api/post'

export const getLatestPosts = async (
  query: z.infer<typeof V1PostsQuerySchema>,
  traceHeaders?: Record<string, string>
): Promise<PostContent[]> => {
  return await getLatestPostsContentApi({
    take: query.take ?? undefined,
    traceHeaders,
  })
}

export const getPost = async (
  {
    slug,
    take,
    postEssayQuestionsTake,
    postChoiceQuestionsTake,
  }: {
    slug: string
    take?: number
    postEssayQuestionsTake?: number
    postChoiceQuestionsTake?: number
  },
  traceHeaders?: Record<string, string>
): Promise<z.infer<typeof V1PostDetailBodySchema> | undefined> => {
  return await getPostContentApi({
    slug,
    take,
    postEssayQuestionsTake,
    postChoiceQuestionsTake,
    traceHeaders,
  })
}

export const getPostMeta = async (
  { slug }: { slug: string },
  traceHeaders?: Record<string, string>
): Promise<z.infer<typeof V1PostMetaBodySchema> | undefined> => {
  return await getPostMetaContentApi({ slug, traceHeaders })
}

export const getPostsEssayAnswersWithLikes = async (
  query: z.infer<typeof V1PostsEssayAnswersWithLikesQuerySchema>,
  traceHeaders?: Record<string, string>
): Promise<z.infer<typeof V1PostsEssayAnswersWithLikesResponseSchema>> => {
  return await getPostsEssayAnswersWithLikesContentApi({ query, traceHeaders })
}

export const getPostEssayQuestionsByPostSlug = async ({
  slug,
  traceHeaders,
}: {
  slug: string
  traceHeaders?: Record<string, string>
}): Promise<z.infer<typeof V1PostEssayQuestionsBodySchema> | undefined> => {
  return await getPostEssayQuestionsByPostSlugContentApi({ slug, traceHeaders })
}

export const getPostsPaged = async (
  query: z.infer<typeof V1PostsQuerySchema>,
  traceHeaders?: Record<string, string>
): Promise<PostContent[]> => {
  return await getPostsPagedContentApi({
    take: query.take ?? undefined,
    skip: query.skip ?? undefined,
    traceHeaders,
  })
}
