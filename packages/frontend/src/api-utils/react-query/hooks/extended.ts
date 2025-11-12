import { GetMemberPostsWithAnswersQueryVariables } from '__generated__/operations/extended.generated'
import { useInfiniteQuery } from '@tanstack/react-query'

import { getMemberPostsWithAnswers } from '@/api/extended'

export const MEMBER_POSTS_WITH_ANSWERS_QUERY_KEY = 'member-posts-with-answers'

export function useGetMemberPostsWithAnswersInfinityQuery({
  accessToken,
  memberId,
  take = 5,
}: Omit<GetMemberPostsWithAnswersQueryVariables, 'nextCursor'> & {
  accessToken: string
}) {
  return useInfiniteQuery({
    queryKey: [MEMBER_POSTS_WITH_ANSWERS_QUERY_KEY, memberId, take],
    queryFn: ({ pageParam }) =>
      getMemberPostsWithAnswers({
        memberId,
        take,
        nextCursor: pageParam ?? undefined,
        accessToken,
      }),
    enabled: !!memberId && !!accessToken,
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
  })
}
