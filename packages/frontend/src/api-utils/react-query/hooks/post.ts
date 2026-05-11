import type {
  V1PostsEssayAnswersWithLikesQuerySchema,
  V1PostsEssayAnswersWithLikesResponseSchema,
} from '@kids-reporter/api-types'
import { InfiniteData, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import type { z } from 'zod'

import { getCategoryPosts } from '@/api/category'
import {
  getPostEssayQuestionsByPostSlug,
  getPostsEssayAnswersWithLikes,
} from '@/api/post'
import { PostWithTwoTopLikesAnswersPerQuestion } from '@/modules/idea-hub/types'

const POSTS_ESSAY_ANSWERS_WITH_LIKES_QUERY_KEY =
  'posts-essay-answers-with-likes'

export function usePostsEssayAnswersWithLikesInfinityQuery({
  take,
  answerOrderBy,
  answerTake,
  select,
}: {
  take: number
  answerOrderBy?: z.infer<
    typeof V1PostsEssayAnswersWithLikesQuerySchema
  >['answerOrderBy']
  answerTake: number
  select?: (
    data: InfiniteData<
      z.infer<typeof V1PostsEssayAnswersWithLikesResponseSchema>
    >
  ) => PostWithTwoTopLikesAnswersPerQuestion['posts']
}) {
  return useInfiniteQuery({
    queryKey: usePostsEssayAnswersWithLikesInfinityQuery.getQueryKey({
      take,
      answerOrderBy,
      answerTake,
    }),
    queryFn: ({ pageParam }) =>
      getPostsEssayAnswersWithLikes({
        take,
        skip: pageParam,
        orderBy: 'publishedDate:desc',
        answerOrderBy: answerOrderBy ?? 'likesCount:desc',
        answerTake,
      }),
    getNextPageParam: (lastPage, _, lastPageParam) => {
      const hasNextPage = (lastPage?.length ?? 0) === take
      return hasNextPage ? lastPageParam + take : undefined
    },
    initialPageParam: 0,
    select,
    refetchOnMount: 'always',
  })
}

usePostsEssayAnswersWithLikesInfinityQuery.getQueryKey = ({
  take,
  answerOrderBy,
  answerTake,
}: {
  take: number
  answerOrderBy?: z.infer<
    typeof V1PostsEssayAnswersWithLikesQuerySchema
  >['answerOrderBy']
  answerTake: number
}) => [
  POSTS_ESSAY_ANSWERS_WITH_LIKES_QUERY_KEY,
  take,
  answerOrderBy,
  answerTake,
]

const POST_ESSAY_QUESTIONS_BY_POST_SLUG_QUERY_KEY =
  'post-essay-questions-by-post-slug'

export function usePostEssayQuestionsByPostSlugQuery({
  slug,
}: {
  slug: string
}) {
  return useQuery({
    queryKey: usePostEssayQuestionsByPostSlugQuery.getQueryKey({ slug }),
    queryFn: () => getPostEssayQuestionsByPostSlug({ slug }),
    enabled: !!slug,
  })
}

usePostEssayQuestionsByPostSlugQuery.getQueryKey = ({
  slug,
}: {
  slug: string
}) => [POST_ESSAY_QUESTIONS_BY_POST_SLUG_QUERY_KEY, slug]

const CATEGORY_POSTS_QUERY_KEY = 'category-posts'

export function useCategoryPostsQuery({
  slug,
  take,
  skip,
}: {
  slug: string
  take: number
  skip: number
}) {
  return useQuery({
    queryKey: useCategoryPostsQuery.getQueryKey({ slug, take, skip }),
    queryFn: () => getCategoryPosts({ slug, take, skip }),
  })
}

useCategoryPostsQuery.getQueryKey = ({
  slug,
  take,
  skip,
}: {
  slug: string
  take: number
  skip: number
}) => [CATEGORY_POSTS_QUERY_KEY, slug, take, skip]
