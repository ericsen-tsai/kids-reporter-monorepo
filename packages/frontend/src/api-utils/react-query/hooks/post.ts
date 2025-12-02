import {
  PostEssayAnswerOrderByInput,
  PostOrderByInput,
  PostWhereInput,
} from '__generated__/types'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import {
  getPostEssayQuestionsByPostSlug,
  getPostsEssayAnswersWithLikes,
} from '@/api/post'

export const POSTS_ESSAY_ANSWERS_WITH_LIKES_QUERY_KEY =
  'posts-essay-answers-with-likes'

export function useGetPostsEssayAnswersWithLikesInfinityQuery({
  orderBy,
  take,
  answerOrderBy,
  answerTake,
  where,
}: {
  orderBy: PostOrderByInput[]
  take: number
  answerOrderBy: PostEssayAnswerOrderByInput[]
  answerTake: number
  where: PostWhereInput
}) {
  return useInfiniteQuery({
    queryKey: [
      POSTS_ESSAY_ANSWERS_WITH_LIKES_QUERY_KEY,
      orderBy,
      take,
      where,
      answerOrderBy,
      answerTake,
    ],
    queryFn: ({ pageParam }) =>
      getPostsEssayAnswersWithLikes({
        orderBy,
        take,
        skip: pageParam,
        answerOrderBy,
        answerTake,
        where,
      }),
    getNextPageParam: (lastPage, _, lastPageParam) => {
      const hasNextPage = (lastPage?.length ?? 0) === take
      return hasNextPage ? lastPageParam + take : undefined
    },
    initialPageParam: 0,
  })
}

export const POST_ESSAY_QUESTIONS_BY_POST_SLUG_QUERY_KEY =
  'post-essay-questions-by-post-slug'

export function useGetPostEssayQuestionsByPostSlugQuery({
  slug,
}: {
  slug: string
}) {
  return useQuery({
    queryKey: [POST_ESSAY_QUESTIONS_BY_POST_SLUG_QUERY_KEY, slug],
    queryFn: () => getPostEssayQuestionsByPostSlug({ slug }),
  })
}
