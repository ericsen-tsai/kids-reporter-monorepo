import { prisma } from '@kids-reporter/db'

import {
  buildCategoryFeedPostWhere,
  buildPublicPostWhere,
  buildResizedMedium,
  mapPostCard,
  postCardSelect,
} from '../v1-helpers.js'

const PUBLISHED_FEED_ORDER = { publishedDate: 'desc' } as const

const ogImageSelect = {
  imageFile_id: true,
  imageFile_extension: true,
} as const

const mapOgImageMedium = (
  img: {
    imageFile_id: string | null
    imageFile_extension: string | null
  } | null
) =>
  img
    ? {
        resized: {
          medium: buildResizedMedium(img),
        },
      }
    : null

export type FeedPagination = {
  take: number
  skip: number
}

/** `GET /v1/subcategories` */
export async function fetchSubcategoriesList() {
  return prisma.subcategory.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      category: {
        select: {
          slug: true,
        },
      },
    },
  })
}

/** `GET /v1/categories/by-slug/:slug/metadata` */
export async function fetchCategoryMetadata(
  slug: string,
  subcategorySlug: string | undefined
) {
  const category = await prisma.category.findUnique({
    where: { slug },
    select: {
      ogTitle: true,
      ogDescription: true,
      ogImage: { select: ogImageSelect },
      subcategories: {
        where: subcategorySlug ? { slug: subcategorySlug } : undefined,
        select: {
          ogTitle: true,
          ogDescription: true,
          ogImage: { select: ogImageSelect },
        },
      },
    },
  })
  if (!category) return null
  return {
    ogTitle: category.ogTitle,
    ogDescription: category.ogDescription,
    ogImage: mapOgImageMedium(category.ogImage),
    subcategories: category.subcategories.map((s) => ({
      ogTitle: s.ogTitle,
      ogDescription: s.ogDescription,
      ogImage: mapOgImageMedium(s.ogImage),
    })),
  }
}

/** `GET /v1/categories/by-slug/:slug/subcategories-theme` */
export async function fetchCategorySubcategoriesTheme(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    select: {
      name: true,
      themeColor: true,
      subcategories: {
        select: { name: true, slug: true },
        orderBy: { name: 'asc' },
      },
    },
  })
  if (!category) return null
  return {
    name: category.name,
    themeColor: category.themeColor,
    subcategories: category.subcategories,
  }
}

/** Walk down to all sub-subcategory ids under a category slug. Empty array if category missing. */
async function collectSubSubcategoryIdsForCategorySlug(
  slug: string
): Promise<number[]> {
  const cat = await prisma.category.findUnique({
    where: { slug },
    select: {
      subcategories: {
        select: {
          subSubcategories: { select: { id: true } },
        },
      },
    },
  })
  if (!cat) return []
  const ids: number[] = []
  for (const sub of cat.subcategories) {
    for (const ss of sub.subSubcategories) {
      ids.push(ss.id)
    }
  }
  return ids
}

/** `GET /v1/categories/by-slug/:slug/posts` (unknown category → empty feed; not 404). */
export async function fetchCategoryFeedPosts(
  slug: string,
  opts: FeedPagination
) {
  const subIds = await collectSubSubcategoryIdsForCategorySlug(slug)
  if (subIds.length === 0) {
    return { relatedPosts: [], relatedPostsCount: 0 }
  }
  const where = buildCategoryFeedPostWhere(subIds)
  const [posts, relatedPostsCount] = await Promise.all([
    prisma.post.findMany({
      take: opts.take,
      skip: opts.skip,
      where,
      orderBy: PUBLISHED_FEED_ORDER,
      select: postCardSelect,
    }),
    prisma.post.count({ where }),
  ])
  return {
    relatedPosts: posts.map(mapPostCard),
    relatedPostsCount,
  }
}

/** `GET /v1/subcategories/by-slug/:slug/posts` (404 when subcategory missing). */
export async function fetchSubcategoryFeedPosts(
  slug: string,
  opts: FeedPagination
) {
  const sub = await prisma.subcategory.findUnique({
    where: { slug },
    select: {
      id: true,
      category: { select: { slug: true } },
      subSubcategories: { select: { id: true } },
    },
  })
  if (!sub) return null

  const categorySlug = sub.category?.slug ?? ''
  const subIds = sub.subSubcategories.map((x) => x.id)
  if (subIds.length === 0) {
    return {
      relatedPosts: [],
      relatedPostsCount: 0,
      category: { slug: categorySlug },
    }
  }
  const where = buildCategoryFeedPostWhere(subIds)
  const [posts, relatedPostsCount] = await Promise.all([
    prisma.post.findMany({
      take: opts.take,
      skip: opts.skip,
      where,
      orderBy: PUBLISHED_FEED_ORDER,
      select: postCardSelect,
    }),
    prisma.post.count({ where }),
  ])
  return {
    relatedPosts: posts.map(mapPostCard),
    relatedPostsCount,
    category: { slug: categorySlug },
  }
}

/** `GET /v1/sub-subcategories/by-slug/:slug/posts` (404 when sub-subcategory missing). */
export async function fetchSubSubcategoryFeedPosts(
  slug: string,
  opts: FeedPagination,
  now: Date
) {
  const ss = await prisma.subSubcategory.findUnique({
    where: { slug },
    select: {
      id: true,
      subcategory: {
        select: {
          slug: true,
          category: { select: { slug: true } },
        },
      },
    },
  })
  if (!ss) return null

  const where = {
    AND: [
      buildPublicPostWhere(now),
      { subSubcategories: { some: { id: ss.id } } },
    ],
  }
  const [posts, relatedPostsCount] = await Promise.all([
    prisma.post.findMany({
      take: opts.take,
      skip: opts.skip,
      where,
      orderBy: PUBLISHED_FEED_ORDER,
      select: postCardSelect,
    }),
    prisma.post.count({ where }),
  ])
  return {
    relatedPosts: posts.map(mapPostCard),
    relatedPostsCount,
    subcategory: {
      slug: ss.subcategory?.slug ?? '',
      category: { slug: ss.subcategory?.category?.slug ?? '' },
    },
  }
}
