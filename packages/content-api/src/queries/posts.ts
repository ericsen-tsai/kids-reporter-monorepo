import { prisma } from '@kids-reporter/db'

import {
  buildPublicPostWhere,
  mapPostCard,
  postCardSelect,
} from '../v1-helpers.js'

/** Server-side default ordering; `orderBy` query param is currently fixed to `publishedDate:desc`. */
const POSTS_LIST_ORDER = { publishedDate: 'desc' } as const

export type FetchPostsListOpts = {
  take: number
  skip: number
}

/** `GET /v1/posts` */
export async function fetchPostsList(opts: FetchPostsListOpts, now: Date) {
  const posts = await prisma.post.findMany({
    take: opts.take,
    skip: opts.skip,
    where: buildPublicPostWhere(now),
    orderBy: POSTS_LIST_ORDER,
    select: postCardSelect,
  })

  return {
    posts: posts.map(mapPostCard),
    page: {
      take: opts.take,
      skip: opts.skip,
    },
  }
}
