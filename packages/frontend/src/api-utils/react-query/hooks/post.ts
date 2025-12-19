import {
  PostEssayAnswerOrderByInput,
  PostOrderByInput,
  PostWhereInput,
} from '__generated__/types'
import { useInfiniteQuery } from '@tanstack/react-query'

import { getPostsEssayAnswersWithLikes } from '@/api/post'

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
