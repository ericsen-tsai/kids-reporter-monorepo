'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { toast } from 'sonner'

import {
  type BookmarkLookup,
  type BookmarkType,
  createBookmarkContentApi,
  deleteBookmarkContentApi,
  getBookmarkBySlugContentApi,
} from '@/api/content-api/bookmarks'
import { aboveToolbarToastOptions } from '@/components/toaster'
import { ContentApiRequestError } from '@/utils/send-content-api'

const MEMBER_BOOKMARK_QUERY_KEY = 'member-bookmark'

const BOOKMARKED_TOAST: Record<BookmarkType, string> = {
  post: '已收藏此文章',
  project: '已收藏此專題',
}

export function useBookmarkQuery({
  type,
  slug,
  accessToken,
  enabled,
}: {
  type: BookmarkType
  slug: string
  accessToken?: string
  enabled: boolean
}) {
  return useQuery({
    queryKey: useBookmarkQuery.getQueryKey(type, slug),
    queryFn: () =>
      getBookmarkBySlugContentApi({
        accessToken: accessToken!,
        type,
        slug,
      }),
    enabled: enabled && !!accessToken && !!slug,
  })
}

useBookmarkQuery.getQueryKey = (type: BookmarkType, slug: string) => [
  MEMBER_BOOKMARK_QUERY_KEY,
  type,
  slug,
]

export function useToggleBookmark({
  type,
  slug,
  accessToken,
  enabled,
}: {
  type: BookmarkType
  slug: string
  accessToken?: string
  enabled: boolean
}) {
  const queryClient = useQueryClient()
  const toggleLockRef = useRef(false)
  const queryKey = useBookmarkQuery.getQueryKey(type, slug)
  const bookmarkedToast = BOOKMARKED_TOAST[type]

  const query = useBookmarkQuery({ type, slug, accessToken, enabled })

  const createMutation = useMutation({
    mutationFn: () => createBookmarkContentApi({ type, slug }, accessToken!),
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

    const current = queryClient.getQueryData<BookmarkLookup | null>(queryKey)
    const isBookmarked = !!current?.id

    toggleLockRef.current = true
    await queryClient.cancelQueries({ queryKey })
    const previous = current

    try {
      if (isBookmarked && current) {
        queryClient.setQueryData<BookmarkLookup | null>(queryKey, null)
        await deleteMutation.mutateAsync(current.id)
        toast.success('已取消收藏', aboveToolbarToastOptions)
      } else {
        queryClient.setQueryData<BookmarkLookup | null>(queryKey, {
          id: 'optimistic',
        })
        try {
          const created = await createMutation.mutateAsync()
          queryClient.setQueryData<BookmarkLookup | null>(queryKey, {
            id: created.id,
          })
        } catch (error) {
          // Already saved on server — refresh real id
          if (error instanceof ContentApiRequestError && error.status === 409) {
            await queryClient.invalidateQueries({ queryKey })
            toast.success(bookmarkedToast, aboveToolbarToastOptions)
            return
          }
          throw error
        }
        toast.success(bookmarkedToast, aboveToolbarToastOptions)
      }
    } catch {
      queryClient.setQueryData(queryKey, previous)
    } finally {
      toggleLockRef.current = false
    }
  }, [
    accessToken,
    bookmarkedToast,
    createMutation,
    deleteMutation,
    queryClient,
    queryKey,
  ])

  return {
    isBookmarked: !!query.data?.id,
    isLoading: query.isLoading,
    isPending: createMutation.isPending || deleteMutation.isPending,
    toggle,
  }
}

export function useTogglePostBookmark({
  postSlug,
  accessToken,
  enabled,
}: {
  postSlug: string
  accessToken?: string
  enabled: boolean
}) {
  return useToggleBookmark({
    type: 'post',
    slug: postSlug,
    accessToken,
    enabled,
  })
}
