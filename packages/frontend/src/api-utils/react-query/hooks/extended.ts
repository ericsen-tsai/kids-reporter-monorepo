import { GetMemberPostsWithAnswersQueryVariables } from '__generated__/operations/extended.generated'
import { useQuery } from '@tanstack/react-query'

import { getMemberPostsWithAnswers } from '@/api/extended'

export const MEMBER_POSTS_WITH_ANSWERS_QUERY_KEY = 'member-posts-with-answers'

export function useGetMemberPostsWithAnswersQuery({
  accessToken,
  memberId,
  take = 5,
  skip = 0,
}: GetMemberPostsWithAnswersQueryVariables & { accessToken: string }) {
  return useQuery({
    queryKey: [MEMBER_POSTS_WITH_ANSWERS_QUERY_KEY, memberId, take, skip],
    queryFn: () =>
      getMemberPostsWithAnswers({ memberId, take, skip, accessToken }),
    enabled: !!memberId && !!accessToken,
  })
}
