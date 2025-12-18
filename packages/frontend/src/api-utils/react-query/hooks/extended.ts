import { GetMemberPostsWithAnswersQueryVariables } from '__generated__/operations/extended.generated'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import {
  getMemberEssayAnswersHasLiked,
  getMemberPostsWithAnswers,
} from '@/api/extended'

export const MEMBER_POSTS_WITH_ANSWERS_QUERY_KEY = 'member-posts-with-answers'

export function useGetMemberPostsWithAnswersInfinityQuery({
  accessToken,
  memberId,
  take = 5,
}: Omit<GetMemberPostsWithAnswersQueryVariables, 'nextCursor'> & {
  accessToken: string
  memberId: string
}) {
  return useInfiniteQuery({
    queryKey: [MEMBER_POSTS_WITH_ANSWERS_QUERY_KEY, memberId, take],
    queryFn: ({ pageParam }) =>
      getMemberPostsWithAnswers({
        take,
        nextCursor: pageParam ?? undefined,
        accessToken,
      }),
    enabled: !!memberId && !!accessToken,
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
  })
}

export const MEMBER_ESSAY_ANSWERS_HAS_LIKED_QUERY_KEY =
  'member-essay-answers-has-liked'

export function useGetMemberEssayAnswersHasLikedQuery({
  memberId,
  answerIds,
  accessToken,
}: {
  memberId: string
  answerIds: string[]
  accessToken: string
}) {
  return useQuery({
    queryKey: [MEMBER_ESSAY_ANSWERS_HAS_LIKED_QUERY_KEY, memberId, answerIds],
    queryFn: () =>
      getMemberEssayAnswersHasLiked({
        answerIds,
        accessToken,
      }),
    enabled: !!memberId && !!accessToken && answerIds.length > 0,
  })
}
