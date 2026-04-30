import {
  GetPostEssayQuestionsQuery,
  GetPostMetaQuery,
  GetPostMetaQueryVariables,
  GetPostQuery,
  GetPostQueryVariables,
  GetPostsEssayAnswersWithLikesQuery,
  GetPostsEssayAnswersWithLikesQueryVariables,
} from '__generated__/operations/content.generated'
import {
  V1PostDetailEnvelopeSchema,
  V1PostEssayQuestionsEnvelopeSchema,
  V1PostMetaEnvelopeSchema,
  V1PostsEssayAnswersWithLikesEnvelopeSchema,
  V1PostsResponseSchema,
} from '@kids-reporter/api-types'

import { sendContentApiRequest } from '@/utils/send-content-api'

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

function postSlugFromWhere(where: GetPostQueryVariables['where']): string {
  const slug =
    where && typeof where === 'object' && 'slug' in where
      ? (where as { slug?: string }).slug
      : undefined
  if (typeof slug !== 'string' || !slug) {
    throw new Error('content-api getPost requires where.slug')
  }
  return slug
}

function postSlugFromMetaWhere(
  where: GetPostMetaQueryVariables['where']
): string {
  const slug =
    where && typeof where === 'object' && 'slug' in where
      ? (where as { slug?: string }).slug
      : undefined
  if (typeof slug !== 'string' || !slug) {
    throw new Error('content-api getPostMeta requires where.slug')
  }
  return slug
}

export async function getPostContentApi({
  variables,
  traceHeaders,
}: {
  variables: GetPostQueryVariables
  traceHeaders?: Record<string, string>
}) {
  const slug = postSlugFromWhere(variables.where)
  const { where: _w, ...rest } = variables
  const variablesJson =
    Object.keys(rest).length > 0 ? JSON.stringify(rest) : undefined
  const response = await sendContentApiRequest({
    path: `/v1/posts/by-slug/${encodeURIComponent(slug)}`,
    method: 'GET',
    query: variablesJson ? { variables: variablesJson } : undefined,
    traceHeaders,
  })
  const parsed = V1PostDetailEnvelopeSchema.safeParse(response)
  if (!parsed.success) {
    throw new Error('content-api response schema mismatch for post by slug')
  }
  return parsed.data.post as GetPostQuery['post']
}

export async function getPostMetaContentApi({
  variables,
  traceHeaders,
}: {
  variables: GetPostMetaQueryVariables
  traceHeaders?: Record<string, string>
}) {
  const slug = postSlugFromMetaWhere(variables.where)
  const response = await sendContentApiRequest({
    path: `/v1/posts/by-slug/${encodeURIComponent(slug)}/meta`,
    method: 'GET',
    traceHeaders,
  })
  const parsed = V1PostMetaEnvelopeSchema.safeParse(response)
  if (!parsed.success) {
    throw new Error('content-api response schema mismatch for post meta')
  }
  return parsed.data.post as GetPostMetaQuery['post']
}

export async function getPostsEssayAnswersWithLikesContentApi({
  variables,
  traceHeaders,
}: {
  variables: GetPostsEssayAnswersWithLikesQueryVariables
  traceHeaders?: Record<string, string>
}) {
  const response = await sendContentApiRequest({
    path: '/v1/posts/essay-answers-with-likes',
    method: 'GET',
    query: { variables: JSON.stringify(variables) },
    traceHeaders,
  })
  const parsed = V1PostsEssayAnswersWithLikesEnvelopeSchema.safeParse(response)
  if (!parsed.success) {
    throw new Error(
      'content-api response schema mismatch for essay-answers-with-likes'
    )
  }
  return parsed.data.posts as GetPostsEssayAnswersWithLikesQuery['posts']
}

export async function getPostEssayQuestionsByPostSlugContentApi({
  slug,
  traceHeaders,
}: {
  slug: string
  traceHeaders?: Record<string, string>
}) {
  const response = await sendContentApiRequest({
    path: `/v1/posts/by-slug/${encodeURIComponent(slug)}/essay-questions`,
    method: 'GET',
    traceHeaders,
  })
  const parsed = V1PostEssayQuestionsEnvelopeSchema.safeParse(response)
  if (!parsed.success) {
    throw new Error(
      'content-api response schema mismatch for post essay-questions'
    )
  }
  return parsed.data.post as GetPostEssayQuestionsQuery['post']
}
