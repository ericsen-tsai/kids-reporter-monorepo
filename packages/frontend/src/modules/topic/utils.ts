import { PostSummary } from '@/components/types'
import { FALLBACK_IMG } from '@/constants'

import { RELATED_POSTS_PER_ROW } from './constants'

export const normalizePhoto = (photo: {
  resized?: { small?: string; medium?: string; large?: string }
}) => {
  return {
    resized: {
      small: photo.resized?.small ?? FALLBACK_IMG,
      medium: photo.resized?.medium ?? photo.resized?.small ?? FALLBACK_IMG,
      large:
        photo.resized?.large ??
        photo.resized?.medium ??
        photo.resized?.small ??
        FALLBACK_IMG,
    },
  }
}

export const groupPostsByRow = (
  posts: PostSummary[],
  viewPort: keyof typeof RELATED_POSTS_PER_ROW
) => {
  return posts.reduce((acc, post, index) => {
    const row = Math.floor(index / RELATED_POSTS_PER_ROW[viewPort])
    if (!acc[row]) {
      acc[row] = []
    }
    acc[row].push(post)
    return acc
  }, [] as PostSummary[][])
}
