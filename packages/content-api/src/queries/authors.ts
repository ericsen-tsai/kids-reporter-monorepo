import { prisma } from '@kids-reporter/db'

import envVar from '../environment-variables.js'
import {
  buildPublicPostWhere,
  buildResizedSmall,
  mapPostCard,
  postCardSelect,
} from '../utils/v1-helpers.js'

const PUBLISHED_FEED_ORDER = { publishedDate: 'desc' } as const

const buildAuthorAvatarTinyUrl = (fileId: string | null | undefined) =>
  fileId ? `${envVar.gcs.origin}/resized/${fileId}-400.webp` : ''

/** `GET /v1/authors/by-slug/:slug/meta` (404 when author missing). */
export async function fetchAuthorMeta(slug: string) {
  const author = await prisma.author.findUnique({
    where: { slug },
    select: {
      slug: true,
      name: true,
      bio: true,
      image: {
        select: { imageFile_id: true, imageFile_extension: true },
      },
    },
  })
  if (!author) return null
  return {
    slug: author.slug,
    name: author.name,
    bio: author.bio,
    image: author.image
      ? { resized: { small: buildResizedSmall(author.image) } }
      : null,
  }
}

/** `GET /v1/authors/by-slug/:slug/posts` (404 when author missing). */
export async function fetchAuthorFeedPosts(
  slug: string,
  opts: { take: number; skip: number },
  now: Date
) {
  const author = await prisma.author.findUnique({
    where: { slug },
    select: {
      id: true,
      bio: true,
      name: true,
      email: true,
      avatar: {
        select: { imageFile_id: true },
      },
    },
  })
  if (!author) return null

  const where = {
    AND: [buildPublicPostWhere(now), { authors: { some: { id: author.id } } }],
  }
  const [posts, postsCount] = await Promise.all([
    prisma.post.findMany({
      take: opts.take,
      skip: opts.skip,
      where,
      orderBy: PUBLISHED_FEED_ORDER,
      select: postCardSelect,
    }),
    prisma.post.count({ where }),
  ])
  const tiny = buildAuthorAvatarTinyUrl(author.avatar?.imageFile_id)
  return {
    bio: author.bio,
    name: author.name,
    email: author.email,
    avatar: author.avatar ? { resized: { tiny } } : null,
    posts: posts.map(mapPostCard),
    postsCount,
  }
}

/** `GET /v1/authors/by-slug/:slug/posts-count` (404 when author missing). */
export async function fetchAuthorPostsCount(slug: string, now: Date) {
  const author = await prisma.author.findUnique({
    where: { slug },
    select: { id: true },
  })
  if (!author) return null

  const postsCount = await prisma.post.count({
    where: {
      AND: [
        buildPublicPostWhere(now),
        { authors: { some: { id: author.id } } },
      ],
    },
  })
  return { postsCount }
}

/** `GET /v1/authors/by-slug/:slug/avatar` (always 200; empty `tiny` for unknown slugs). */
export async function fetchAuthorAvatar(slug: string) {
  const author = await prisma.author.findUnique({
    where: { slug },
    select: {
      avatar: {
        select: { imageFile_id: true },
      },
    },
  })
  return { tiny: buildAuthorAvatarTinyUrl(author?.avatar?.imageFile_id) }
}
