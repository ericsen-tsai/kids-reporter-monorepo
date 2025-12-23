import { GetMemberPostsWithAnswersQueryVariables } from '__generated__/operations/extended.generated'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import {
  getMemberEssayAnswersHasLiked,
  getMemberPostsWithAnswers,
} from '@/api/extended'

const MEMBER_POSTS_WITH_ANSWERS_QUERY_KEY = 'member-posts-with-answers'

export function useMemberPostsWithAnswersInfinityQuery({
  accessToken,
  memberId,
  take = 5,
}: Omit<GetMemberPostsWithAnswersQueryVariables, 'nextCursor'> & {
  accessToken: string
  memberId: string
}) {
  return useInfiniteQuery({
    queryKey: useMemberPostsWithAnswersInfinityQuery.getQueryKey({
      memberId,
      take,
    }),
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

useMemberPostsWithAnswersInfinityQuery.getQueryKey = ({
  memberId,
  take,
}: {
  memberId: string
  take: number
}) => [MEMBER_POSTS_WITH_ANSWERS_QUERY_KEY, memberId, take]

const MEMBER_ESSAY_ANSWERS_HAS_LIKED_QUERY_KEY =
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
    queryKey: useGetMemberEssayAnswersHasLikedQuery.getQueryKey({
      memberId,
      answerIds,
    }),
    queryFn: () =>
      getMemberEssayAnswersHasLiked({
        answerIds,
        accessToken,
      }),
    enabled: !!memberId && !!accessToken && answerIds.length > 0,
  })
}

useGetMemberEssayAnswersHasLikedQuery.getQueryKey = ({
  memberId,
  answerIds,
}: {
  memberId: string
  answerIds: string[]
}) => [MEMBER_ESSAY_ANSWERS_HAS_LIKED_QUERY_KEY, memberId, answerIds]
