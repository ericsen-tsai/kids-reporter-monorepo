'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { toast } from 'sonner'

import {
  createBookmarkContentApi,
  deleteBookmarkContentApi,
  getPostBookmarkBySlugContentApi,
  type PostBookmarkLookup,
} from '@/api/content-api/bookmarks'
import { aboveToolbarToastOptions } from '@/components/toaster'
import { ContentApiRequestError } from '@/utils/send-content-api'

const MEMBER_POST_BOOKMARK_QUERY_KEY = 'member-post-bookmark'

export function usePostBookmarkQuery({
  postSlug,
  accessToken,
  enabled,
}: {
  postSlug: string
  accessToken?: string
  enabled: boolean
}) {
  return useQuery({
    queryKey: usePostBookmarkQuery.getQueryKey(postSlug),
    queryFn: () =>
      getPostBookmarkBySlugContentApi({
        accessToken: accessToken!,
        slug: postSlug,
      }),
    enabled: enabled && !!accessToken && !!postSlug,
  })
}

usePostBookmarkQuery.getQueryKey = (postSlug: string) => [
  MEMBER_POST_BOOKMARK_QUERY_KEY,
  postSlug,
]

export function useTogglePostBookmark({
  postSlug,
  accessToken,
  enabled,
}: {
  postSlug: string
  accessToken?: string
  enabled: boolean
}) {
  const queryClient = useQueryClient()
  const toggleLockRef = useRef(false)
  const queryKey = usePostBookmarkQuery.getQueryKey(postSlug)

  const query = usePostBookmarkQuery({ postSlug, accessToken, enabled })

  const createMutation = useMutation({
    mutationFn: () =>
      createBookmarkContentApi({ type: 'post', slug: postSlug }, accessToken!),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBookmarkContentApi(id, accessToken!),
  })

  const toggle = useCallback(async () => {
    if (
      !accessToken ||
      toggleLockRef.current ||
      createMutation.isPending ||
      deleteMutation.isPending
    ) {
      return
    }

    const current = queryClient.getQueryData<PostBookmarkLookup | null>(
      queryKey
    )
    const isBookmarked = !!current?.id

    toggleLockRef.current = true
    await queryClient.cancelQueries({ queryKey })
    const previous = current

    try {
      if (isBookmarked && current) {
        queryClient.setQueryData<PostBookmarkLookup | null>(queryKey, null)
        await deleteMutation.mutateAsync(current.id)
        toast.success('已取消收藏', aboveToolbarToastOptions)
      } else {
        queryClient.setQueryData<PostBookmarkLookup | null>(queryKey, {
          id: 'optimistic',
        })
        try {
          const created = await createMutation.mutateAsync()
          queryClient.setQueryData<PostBookmarkLookup | null>(queryKey, {
            id: created.id,
          })
        } catch (error) {
          // Already saved on server — refresh real id
          if (error instanceof ContentApiRequestError && error.status === 409) {
            await queryClient.invalidateQueries({ queryKey })
            toast.success('已收藏此文章', aboveToolbarToastOptions)
            return
          }
          throw error
        }
        toast.success('已收藏此文章', aboveToolbarToastOptions)
      }
    } catch {
      queryClient.setQueryData(queryKey, previous)
    } finally {
      toggleLockRef.current = false
    }
  }, [accessToken, createMutation, deleteMutation, queryClient, queryKey])

  return {
    isBookmarked: !!query.data?.id,
    isLoading: query.isLoading,
    isPending: createMutation.isPending || deleteMutation.isPending,
    toggle,
  }
}
