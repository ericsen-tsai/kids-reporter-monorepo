import {
  V1PostDetailBodySchema,
  V1PostEssayQuestionsBodySchema,
  V1PostMetaBodySchema,
  V1PostsEssayAnswersWithLikesQuerySchema,
  V1PostsEssayAnswersWithLikesResponseSchema,
  V1PostsResponseSchema,
} from '@kids-reporter/api-types'
import type { z } from 'zod'

import {
  ContentApiRequestError,
  sendContentApiRequest,
} from '@/utils/send-content-api'

async function fetchPostsV1({
  take,
  skip,
  traceHeaders,
}: {
  take?: number
  skip?: number
  traceHeaders?: Record<string, string>
}) {
  const response = await sendContentApiRequest({
    path: '/v1/posts',
    method: 'GET',
    query: {
      take,
      skip,
      orderBy: 'publishedDate:desc',
    },
    traceHeaders,
  })

  const parsed = V1PostsResponseSchema.safeParse(response)
  if (!parsed.success) {
    throw new Error('content-api response schema mismatch for /v1/posts')
  }
  return parsed.data.posts
}

export async function getLatestPostsContentApi({
  take,
  traceHeaders,
}: {
  take?: number
  traceHeaders?: Record<string, string>
}) {
  return fetchPostsV1({ take, traceHeaders })
}

export async function getPostsPagedContentApi({
  take,
  skip,
  traceHeaders,
}: {
  take?: number
  skip?: number
  traceHeaders?: Record<string, string>
}) {
  return fetchPostsV1({ take, skip, traceHeaders })
}

export async function getPostContentApi({
  slug,
  take,
  postEssayQuestionsTake,
  postChoiceQuestionsTake,
  traceHeaders,
}: {
  slug: string
  take?: number
  postEssayQuestionsTake?: number
  postChoiceQuestionsTake?: number
  traceHeaders?: Record<string, string>
}) {
  try {
    const response = await sendContentApiRequest({
      path: `/v1/posts/by-slug/${encodeURIComponent(slug)}`,
      method: 'GET',
      query: {
        take,
        postEssayQuestionsTake,
        postChoiceQuestionsTake,
      },
      traceHeaders,
    })
    const parsed = V1PostDetailBodySchema.safeParse(response)
    if (!parsed.success) {
      throw new Error('content-api response schema mismatch for post by slug')
    }
    return parsed.data
  } catch (e) {
    if (e instanceof ContentApiRequestError && e.status === 404) {
      return undefined
    }
    throw e
  }
}

export async function getPostMetaContentApi({
  slug,
  traceHeaders,
}: {
  slug: string
  traceHeaders?: Record<string, string>
}) {
  try {
    const response = await sendContentApiRequest({
      path: `/v1/posts/by-slug/${encodeURIComponent(slug)}/meta`,
      method: 'GET',
      traceHeaders,
    })
    const parsed = V1PostMetaBodySchema.safeParse(response)
    if (!parsed.success) {
      throw new Error('content-api response schema mismatch for post meta')
    }
    return parsed.data
  } catch (e) {
    if (e instanceof ContentApiRequestError && e.status === 404) {
      return undefined
    }
    throw e
  }
}

export async function getPostsEssayAnswersWithLikesContentApi({
  query,
  traceHeaders,
}: {
  query: z.infer<typeof V1PostsEssayAnswersWithLikesQuerySchema>
  traceHeaders?: Record<string, string>
}) {
  const response = await sendContentApiRequest({
    path: '/v1/posts/essay-answers-with-likes',
    method: 'GET',
    query: {
      take: query.take ?? undefined,
      skip: query.skip ?? undefined,
      orderBy: 'publishedDate:desc',
      answerTake: query.answerTake ?? undefined,
      answerOrderBy: query.answerOrderBy ?? 'likesCount:desc',
    },
    traceHeaders,
  })
  const parsed = V1PostsEssayAnswersWithLikesResponseSchema.safeParse(response)
  if (!parsed.success) {
    throw new Error(
      'content-api response schema mismatch for essay-answers-with-likes'
    )
  }
  return parsed.data
}

export async function getPostEssayQuestionsByPostSlugContentApi({
  slug,
  traceHeaders,
}: {
  slug: string
  traceHeaders?: Record<string, string>
}) {
  try {
    const response = await sendContentApiRequest({
      path: `/v1/posts/by-slug/${encodeURIComponent(slug)}/essay-questions`,
      method: 'GET',
      traceHeaders,
    })
    const parsed = V1PostEssayQuestionsBodySchema.safeParse(response)
    if (!parsed.success) {
      throw new Error(
        'content-api response schema mismatch for post essay-questions'
      )
    }
    return parsed.data
  } catch (e) {
    if (e instanceof ContentApiRequestError && e.status === 404) {
      return undefined
    }
    throw e
  }
}
