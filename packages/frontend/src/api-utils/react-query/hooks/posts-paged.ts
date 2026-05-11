import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

import { getPostsPaged } from '@/api/post'
import { PostSummary } from '@/components/types'
import { getPostSummaries } from '@/utils'

const POSTS_PAGED_INFINITY_QUERY_KEY = 'posts-paged-infinity'

export function usePostsPagedInfiniteQuery({
  take,
  initialPosts,
}: {
  take: number
  initialPosts?: PostSummary[]
}) {
  return useInfiniteQuery({
    queryKey: usePostsPagedInfiniteQuery.getQueryKey({ take }),
    queryFn: async ({ pageParam }) => {
      const posts = await getPostsPaged({
        take,
        skip: pageParam,
        orderBy: 'publishedDate:desc',
      })
      return getPostSummaries(posts ?? [])
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      const hasNextPage = lastPage.length === take
      return hasNextPage ? lastPageParam + take : undefined
    },
    ...(initialPosts
      ? ({
          initialData: {
            pages: [initialPosts],
            pageParams: [0],
          } satisfies InfiniteData<PostSummary[], number>,
        } as const)
      : null),
  })
}

usePostsPagedInfiniteQuery.getQueryKey = ({ take }: { take: number }) => [
  POSTS_PAGED_INFINITY_QUERY_KEY,
  take,
]
