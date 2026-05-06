import {
  V1AllPostEssayAnswersQuerySchema,
  V1AuthorAvatarPathParamsSchema,
  V1CallBaodaozaiIntroPathParamsSchema,
  V1CategoryBySlugMetadataQuerySchema,
  V1CategoryPostsQuerySchema,
  V1EditorPicksSettingsQuerySchema,
  V1FeedSlugPathParamsSchema,
  V1PostBySlugPathParamsSchema,
  V1PostBySlugQuerySchema,
  V1PostEssayQuestionAnswersParamsSchema,
  V1PostEssayQuestionAnswersQuerySchema,
  V1PostsEssayAnswersWithLikesQuerySchema,
  V1PostsQuerySchema,
  V1ProjectsQuerySchema,
  V1SitemapsQuerySchema,
  V1SubSubcategoryBySlugPostsQuerySchema,
} from '@kids-reporter/api-types'
import { prisma } from '@kids-reporter/db'
import express from 'express'
import { z } from 'zod'

import { asyncRoute } from '../../async-route.js'
import envVar from '../../environment-variables.js'
import { maskEmail } from '../../mask-email.js'
import {
  fetchPostDetailBySlug,
  fetchPostEssayQuestionsBySlug,
  fetchPostMetaBySlug,
  fetchPostsEssayAnswersWithLikes,
  fetchPublishedProjectDetailBySlug,
  fetchPublishedProjectMetaBySlug,
} from '../../post-detail-queries.js'
import {
  buildMemberAvatarFileUrl,
  essayAnswerOrderByFromFlat,
} from '../../qna-utils.js'
import { sendJsonError } from '../../send-json-error.js'
import {
  asOrderJson,
  buildCategoryFeedPostWhere,
  buildPublicPostWhere,
  buildResizedMedium,
  buildResizedSmall,
  mapPostCard,
  orderTargetsByOrderJson,
  type PostCardRow,
  postCardSelect,
} from '../../v1-helpers.js'
import { createV1MembersRouter } from './v1-members.js'
import { createV1QnaMembersRouter } from './v1-qna-members.js'

const publishedProjectWhere = { status: 'published' as const }

/** Matches idea-hub `GetPostsEssayAnswersWithLikes` filter (inlined; no client `where` blob). */
const POSTS_ESSAY_ANSWERS_WITH_LIKES_WHERE = {
  postEssayQuestions: {
    some: {
      answers: {
        some: {},
      },
    },
  },
} as const

function sitemapPublishedSinceUtc(sinceDays: number): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return new Date(d.getTime() - sinceDays * 24 * 60 * 60 * 1000)
}

function firstQueryString(v: unknown): string | undefined {
  if (typeof v === 'string') return v
  if (Array.isArray(v) && typeof v[0] === 'string') return v[0]
  return undefined
}

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

const postOrderByFromQuery = (
  _orderBy: z.infer<typeof V1SubSubcategoryBySlugPostsQuerySchema>['orderBy']
) => ({ publishedDate: 'desc' }) as const

export function createV1Router() {
  const router = express.Router()

  router.use('/members', createV1MembersRouter())
  router.use('/members', createV1QnaMembersRouter())

  router.get(
    '/posts',
    asyncRoute(async (req, res) => {
      const q = V1PostsQuerySchema.parse(req.query)
      const take = q.take ?? 12
      const skip = q.skip ?? 0
      const now = new Date()
      const where = buildPublicPostWhere(now)

      const posts = await prisma.post.findMany({
        take,
        skip,
        where,
        orderBy: postOrderByFromQuery(q.orderBy ?? 'publishedDate:desc'),
        select: postCardSelect,
      })

      res.json({
        posts: posts.map(mapPostCard),
        page: {
          take,
          skip,
        },
      })
    })
  )

  router.get(
    '/posts/essay-answers-with-likes',
    asyncRoute(async (req, res) => {
      const q = V1PostsEssayAnswersWithLikesQuerySchema.parse(req.query)
      const posts = await fetchPostsEssayAnswersWithLikes(
        {
          take: q.take,
          skip: q.skip,
          orderBy: [{ publishedDate: 'desc' }],
          answerTake: q.answerTake,
          answerOrderBy: q.answerOrderBy,
          where: POSTS_ESSAY_ANSWERS_WITH_LIKES_WHERE,
        },
        new Date()
      )
      res.json(posts)
    })
  )

  router.get(
    '/posts/by-slug/:slug',
    asyncRoute(async (req, res) => {
      const { slug } = V1PostBySlugPathParamsSchema.parse(req.params)
      const q = V1PostBySlugQuerySchema.parse(req.query)
      const post = await fetchPostDetailBySlug(slug, new Date(), {
        take: q.take,
        postEssayQuestionsTake: q.postEssayQuestionsTake,
        postChoiceQuestionsTake: q.postChoiceQuestionsTake,
      })
      if (!post) {
        sendJsonError(res, 404, 'not_found', 'Not found')
        return
      }
      res.json(post)
    })
  )

  router.get(
    '/posts/by-slug/:slug/meta',
    asyncRoute(async (req, res) => {
      const { slug } = V1PostBySlugPathParamsSchema.parse(req.params)
      const post = await fetchPostMetaBySlug(slug, new Date())
      if (!post) {
        sendJsonError(res, 404, 'not_found', 'Not found')
        return
      }
      res.json(post)
    })
  )

  router.get(
    '/posts/by-slug/:slug/essay-questions',
    asyncRoute(async (req, res) => {
      const { slug } = V1PostBySlugPathParamsSchema.parse(req.params)
      const post = await fetchPostEssayQuestionsBySlug(slug, new Date())
      if (!post) {
        sendJsonError(res, 404, 'not_found', 'Not found')
        return
      }
      res.json(post)
    })
  )

  router.get(
    '/sitemaps/posts',
    asyncRoute(async (req, res) => {
      const q = V1SitemapsQuerySchema.parse(req.query)
      const now = new Date()
      const gte = sitemapPublishedSinceUtc(q.sinceDays)
      const posts = await prisma.post.findMany({
        where: {
          AND: [buildPublicPostWhere(now), { publishedDate: { gte } }],
        },
        select: { slug: true, publishedDate: true },
      })
      res.json(
        posts.map((p) => ({
          slug: p.slug,
          publishedDate: p.publishedDate ? p.publishedDate.toISOString() : null,
        }))
      )
    })
  )

  router.get(
    '/sitemaps/projects',
    asyncRoute(async (req, res) => {
      const q = V1SitemapsQuerySchema.parse(req.query)
      const gte = sitemapPublishedSinceUtc(q.sinceDays)
      const projects = await prisma.project.findMany({
        where: {
          ...publishedProjectWhere,
          publishedDate: { gte },
        },
        select: { slug: true, publishedDate: true },
      })
      res.json(
        projects.map((p) => ({
          slug: p.slug,
          publishedDate: p.publishedDate ? p.publishedDate.toISOString() : null,
        }))
      )
    })
  )

  router.get(
    '/projects/by-slug/:slug',
    asyncRoute(async (req, res) => {
      const { slug } = V1PostBySlugPathParamsSchema.parse(req.params)
      const project = await fetchPublishedProjectDetailBySlug(slug, new Date())
      if (!project) {
        sendJsonError(res, 404, 'not_found', 'Not found')
        return
      }
      res.json(project)
    })
  )

  router.get(
    '/projects/by-slug/:slug/meta',
    asyncRoute(async (req, res) => {
      const { slug } = V1PostBySlugPathParamsSchema.parse(req.params)
      const meta = await fetchPublishedProjectMetaBySlug(slug)
      if (!meta) {
        sendJsonError(res, 404, 'not_found', 'Not found')
        return
      }
      res.json(meta)
    })
  )

  router.get(
    '/projects/by-slug/:slug/related-posts-count',
    asyncRoute(async (req, res) => {
      const { slug } = V1PostBySlugPathParamsSchema.parse(req.params)
      const now = new Date()
      const project = await prisma.project.findFirst({
        where: { slug, ...publishedProjectWhere },
        select: { id: true },
      })
      if (!project) {
        sendJsonError(res, 404, 'not_found', 'Not found')
        return
      }
      const relatedPostsCount = await prisma.post.count({
        where: {
          AND: [
            buildPublicPostWhere(now),
            { projects: { some: { id: project.id } } },
          ],
        },
      })
      res.json({ relatedPostsCount })
    })
  )

  router.get(
    '/editor-picks-settings',
    asyncRoute(async (req, res) => {
      const q = V1EditorPicksSettingsQuerySchema.parse(req.query)
      const now = new Date()
      const postWhere = buildPublicPostWhere(now)

      const settings = await prisma.editorPicksSetting.findMany({
        take: q.take,
        orderBy: { id: 'asc' },
        select: {
          id: true,
          editorPicksOfPostsOrderJson: true,
          popularKeywordsOrderJson: true,
          editorPicksOfPosts: {
            where: postWhere,
            select: postCardSelect,
          },
          editorPicksOfTags: {
            select: { name: true, slug: true },
          },
          popularKeywords: {
            select: { id: true, name: true },
          },
        },
      })

      res.json(
        settings.map((s) => {
          const editorPicksOfPostsOrdered = orderTargetsByOrderJson(
            s.editorPicksOfPosts,
            asOrderJson(s.editorPicksOfPostsOrderJson)
          ).map(mapPostCard)

          const popularKeywordsOrdered = orderTargetsByOrderJson(
            s.popularKeywords,
            asOrderJson(s.popularKeywordsOrderJson)
          ).map((k) => ({ name: k.name }))

          return {
            id: s.id,
            editorPicksOfPostsOrdered,
            editorPicksOfTags: s.editorPicksOfTags,
            popularKeywordsOrdered,
          }
        })
      )
    })
  )

  router.get(
    '/popular-keywords',
    asyncRoute(async (_req, res) => {
      const setting = await prisma.editorPicksSetting.findFirst({
        orderBy: { id: 'asc' },
        select: {
          popularKeywordsOrderJson: true,
          popularKeywords: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      if (!setting) {
        res.json([])
        return
      }

      const popularKeywords = orderTargetsByOrderJson(
        setting.popularKeywords,
        asOrderJson(setting.popularKeywordsOrderJson)
      ).map((k) => ({ name: k.name }))

      res.json(popularKeywords)
    })
  )

  router.get(
    '/projects',
    asyncRoute(async (req, res) => {
      const q = V1ProjectsQuerySchema.parse(req.query)
      const take = q.take ?? 12
      const skip = q.skip ?? 0
      const includeRelatedPosts = q.includeRelatedPosts ?? false
      const now = new Date()

      const projectsCount = await prisma.project.count({
        where: publishedProjectWhere,
      })

      const baseSelect = {
        title: true,
        subtitle: true,
        slug: true,
        ogDescription: true,
        publishedDate: true,
        heroImage: {
          select: { imageFile_id: true, imageFile_extension: true },
        },
        relatedPostsOrderJson: true,
      } as const

      const projects = await prisma.project.findMany({
        take,
        skip,
        where: publishedProjectWhere,
        orderBy: postOrderByFromQuery(q.orderBy ?? 'publishedDate:desc'),
        select: includeRelatedPosts
          ? {
              ...baseSelect,
              relatedPosts: {
                where: buildPublicPostWhere(now),
                orderBy: [{ publishedDate: 'desc' }],
                select: postCardSelect,
              },
            }
          : baseSelect,
      })

      res.json({
        projects: projects.map((p) => {
          const row = p as typeof p & {
            relatedPosts?: PostCardRow[]
          }
          const relatedPostsOrdered =
            includeRelatedPosts && row.relatedPosts
              ? orderTargetsByOrderJson(
                  row.relatedPosts,
                  asOrderJson(row.relatedPostsOrderJson)
                ).map(mapPostCard)
              : undefined
          const hero = p.heroImage
          return {
            title: p.title,
            subtitle: p.subtitle,
            slug: p.slug,
            ogDescription: p.ogDescription,
            publishedDate: p.publishedDate
              ? p.publishedDate.toISOString()
              : null,
            heroImage: hero
              ? {
                  resized: {
                    small: buildResizedSmall(hero),
                    medium: buildResizedMedium(hero),
                  },
                }
              : null,
            ...(relatedPostsOrdered !== undefined
              ? { relatedPostsOrdered }
              : {}),
          }
        }),
        projectsCount,
      })
    })
  )

  router.get(
    '/call-baodaozai-intros/:page',
    asyncRoute(async (req, res) => {
      const { page } = V1CallBaodaozaiIntroPathParamsSchema.parse(req.params)

      const intro = await prisma.callBaodaozaiIntro.findFirst({
        where: { page },
        select: { id: true, page: true, content: true },
      })

      if (!intro) {
        sendJsonError(res, 404, 'not_found', 'Not found')
        return
      }

      res.json({
        id: intro.id,
        page: intro.page,
        content: intro.content,
      })
    })
  )

  router.get(
    '/subcategories',
    asyncRoute(async (_req, res) => {
      const subcategories = await prisma.subcategory.findMany({
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
      res.json(subcategories)
    })
  )

  router.get(
    '/categories/by-slug/:slug/posts',
    asyncRoute(async (req, res) => {
      const { slug } = V1FeedSlugPathParamsSchema.parse(req.params)
      const q = V1CategoryPostsQuerySchema.parse(req.query)
      const take = q.take ?? 12
      const skip = q.skip ?? 0
      const subIds = await collectSubSubcategoryIdsForCategorySlug(slug)
      if (subIds.length === 0) {
        res.json({ relatedPosts: [], relatedPostsCount: 0 })
        return
      }
      const where = buildCategoryFeedPostWhere(subIds)
      const [posts, relatedPostsCount] = await Promise.all([
        prisma.post.findMany({
          take,
          skip,
          where,
          orderBy: { publishedDate: 'desc' },
          select: postCardSelect,
        }),
        prisma.post.count({ where }),
      ])
      res.json({
        relatedPosts: posts.map(mapPostCard),
        relatedPostsCount,
      })
    })
  )

  router.get(
    '/categories/by-slug/:slug/metadata',
    asyncRoute(async (req, res) => {
      const { slug } = V1FeedSlugPathParamsSchema.parse(req.params)
      const { subcategorySlug } = V1CategoryBySlugMetadataQuerySchema.parse({
        ...req.query,
        subcategorySlug: firstQueryString(req.query.subcategorySlug),
      })

      const category = await prisma.category.findUnique({
        where: { slug },
        select: {
          ogTitle: true,
          ogDescription: true,
          ogImage: {
            select: { imageFile_id: true, imageFile_extension: true },
          },
          subcategories: {
            where: subcategorySlug ? { slug: subcategorySlug } : undefined,
            select: {
              ogTitle: true,
              ogDescription: true,
              ogImage: {
                select: { imageFile_id: true, imageFile_extension: true },
              },
            },
          },
        },
      })
      if (!category) {
        sendJsonError(res, 404, 'not_found', 'Not found')
        return
      }
      const mapOg = (
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
      res.json({
        ogTitle: category.ogTitle,
        ogDescription: category.ogDescription,
        ogImage: mapOg(category.ogImage),
        subcategories: category.subcategories.map((s) => ({
          ogTitle: s.ogTitle,
          ogDescription: s.ogDescription,
          ogImage: mapOg(s.ogImage),
        })),
      })
    })
  )

  router.get(
    '/categories/by-slug/:slug/subcategories-theme',
    asyncRoute(async (req, res) => {
      const { slug } = V1FeedSlugPathParamsSchema.parse(req.params)
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
      if (!category) {
        sendJsonError(res, 404, 'not_found', 'Not found')
        return
      }
      res.json({
        name: category.name,
        themeColor: category.themeColor,
        subcategories: category.subcategories,
      })
    })
  )

  router.get(
    '/subcategories/by-slug/:slug/posts',
    asyncRoute(async (req, res) => {
      const { slug } = V1FeedSlugPathParamsSchema.parse(req.params)
      const q = V1CategoryPostsQuerySchema.parse(req.query)
      const take = q.take ?? 12
      const skip = q.skip ?? 0
      const sub = await prisma.subcategory.findUnique({
        where: { slug },
        select: {
          id: true,
          category: { select: { slug: true } },
          subSubcategories: { select: { id: true } },
        },
      })
      if (!sub) {
        sendJsonError(res, 404, 'not_found', 'Not found')
        return
      }
      const subIds = sub.subSubcategories.map((x) => x.id)
      if (subIds.length === 0) {
        res.json({
          relatedPosts: [],
          relatedPostsCount: 0,
          category: { slug: sub.category?.slug ?? '' },
        })
        return
      }
      const where = buildCategoryFeedPostWhere(subIds)
      const [posts, relatedPostsCount] = await Promise.all([
        prisma.post.findMany({
          take,
          skip,
          where,
          orderBy: { publishedDate: 'desc' },
          select: postCardSelect,
        }),
        prisma.post.count({ where }),
      ])
      res.json({
        relatedPosts: posts.map(mapPostCard),
        relatedPostsCount,
        category: { slug: sub.category?.slug ?? '' },
      })
    })
  )

  router.get(
    '/sub-subcategories/by-slug/:slug/posts',
    asyncRoute(async (req, res) => {
      const { slug } = V1FeedSlugPathParamsSchema.parse(req.params)
      const q = V1SubSubcategoryBySlugPostsQuerySchema.parse(req.query)
      const take = q.take ?? 12
      const skip = q.skip ?? 0
      const now = new Date()
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
      if (!ss) {
        sendJsonError(res, 404, 'not_found', 'Not found')
        return
      }
      const where = {
        AND: [
          buildPublicPostWhere(now),
          { subSubcategories: { some: { id: ss.id } } },
        ],
      }
      const [posts, relatedPostsCount] = await Promise.all([
        prisma.post.findMany({
          take,
          skip,
          where,
          orderBy: postOrderByFromQuery(q.orderBy),
          select: postCardSelect,
        }),
        prisma.post.count({ where }),
      ])
      res.json({
        relatedPosts: posts.map(mapPostCard),
        relatedPostsCount,
        subcategory: {
          slug: ss.subcategory?.slug ?? '',
          category: { slug: ss.subcategory?.category?.slug ?? '' },
        },
      })
    })
  )

  router.get(
    '/tags/by-slug/:slug/meta',
    asyncRoute(async (req, res) => {
      const { slug } = V1FeedSlugPathParamsSchema.parse(req.params)
      const tag = await prisma.tag.findUnique({
        where: { slug },
        select: {
          ogTitle: true,
          ogDescription: true,
          ogImage: {
            select: { imageFile_id: true, imageFile_extension: true },
          },
        },
      })
      if (!tag) {
        sendJsonError(res, 404, 'not_found', 'Not found')
        return
      }
      res.json({
        ogTitle: tag.ogTitle,
        ogDescription: tag.ogDescription,
        ogImage: tag.ogImage
          ? { resized: { small: buildResizedSmall(tag.ogImage) } }
          : null,
      })
    })
  )

  router.get(
    '/tags/by-slug/:slug/posts',
    asyncRoute(async (req, res) => {
      const { slug } = V1FeedSlugPathParamsSchema.parse(req.params)
      const q = V1SubSubcategoryBySlugPostsQuerySchema.parse(req.query)
      const take = q.take ?? 12
      const skip = q.skip ?? 0
      const now = new Date()
      const tag = await prisma.tag.findUnique({
        where: { slug },
        select: { id: true, name: true },
      })
      if (!tag) {
        sendJsonError(res, 404, 'not_found', 'Not found')
        return
      }
      const where = {
        AND: [buildPublicPostWhere(now), { tags: { some: { id: tag.id } } }],
      }
      const [posts, postsCount] = await Promise.all([
        prisma.post.findMany({
          take,
          skip,
          where,
          orderBy: postOrderByFromQuery(q.orderBy),
          select: postCardSelect,
        }),
        prisma.post.count({ where }),
      ])
      res.json({
        posts: posts.map(mapPostCard),
        postsCount,
        name: tag.name,
      })
    })
  )

  router.get(
    '/authors/by-slug/:slug/meta',
    asyncRoute(async (req, res) => {
      const { slug } = V1FeedSlugPathParamsSchema.parse(req.params)
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
      if (!author) {
        sendJsonError(res, 404, 'not_found', 'Not found')
        return
      }
      res.json({
        slug: author.slug,
        name: author.name,
        bio: author.bio,
        image: author.image
          ? { resized: { small: buildResizedSmall(author.image) } }
          : null,
      })
    })
  )

  router.get(
    '/authors/by-slug/:slug/posts',
    asyncRoute(async (req, res) => {
      const { slug } = V1FeedSlugPathParamsSchema.parse(req.params)
      const q = V1SubSubcategoryBySlugPostsQuerySchema.parse(req.query)
      const take = q.take ?? 12
      const skip = q.skip ?? 0
      const now = new Date()
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
      if (!author) {
        sendJsonError(res, 404, 'not_found', 'Not found')
        return
      }
      const where = {
        AND: [
          buildPublicPostWhere(now),
          { authors: { some: { id: author.id } } },
        ],
      }
      const [posts, postsCount] = await Promise.all([
        prisma.post.findMany({
          take,
          skip,
          where,
          orderBy: postOrderByFromQuery(q.orderBy),
          select: postCardSelect,
        }),
        prisma.post.count({ where }),
      ])
      const fileId = author.avatar?.imageFile_id
      const tiny = fileId
        ? `${envVar.gcs.origin}/resized/${fileId}-400.webp`
        : ''
      res.json({
        bio: author.bio,
        name: author.name,
        email: author.email,
        avatar: author.avatar ? { resized: { tiny } } : null,
        posts: posts.map(mapPostCard),
        postsCount,
      })
    })
  )

  router.get(
    '/authors/by-slug/:slug/posts-count',
    asyncRoute(async (req, res) => {
      const { slug } = V1FeedSlugPathParamsSchema.parse(req.params)
      const now = new Date()
      const author = await prisma.author.findUnique({
        where: { slug },
        select: { id: true },
      })
      if (!author) {
        sendJsonError(res, 404, 'not_found', 'Not found')
        return
      }
      const postsCount = await prisma.post.count({
        where: {
          AND: [
            buildPublicPostWhere(now),
            { authors: { some: { id: author.id } } },
          ],
        },
      })
      res.json({ postsCount })
    })
  )

  router.get(
    '/post-essay-answers',
    asyncRoute(async (req, res) => {
      const q = V1AllPostEssayAnswersQuerySchema.parse(req.query)
      const take = q.take ?? 10
      const orderBy = essayAnswerOrderByFromFlat(q.orderBy)
      const rows = await prisma.postEssayAnswer.findMany({
        take,
        orderBy,
        select: {
          id: true,
          createdAt: true,
          content: true,
          likesCount: true,
          question: {
            select: {
              id: true,
              title: true,
              post: { select: { slug: true } },
            },
          },
          member: {
            select: {
              id: true,
              name: true,
              nickname: true,
              email: true,
              avatar: {
                select: {
                  id: true,
                  imageFile_id: true,
                  imageFile_extension: true,
                },
              },
            },
          },
        },
      })
      res.set('Cache-Control', 'public, max-age=60')
      res.json(
        rows.map((r) => ({
          id: String(r.id),
          createdAt: r.createdAt?.toISOString(),
          question: r.question
            ? {
                id: String(r.question.id),
                title: r.question.title,
                post: r.question.post
                  ? { slug: r.question.post.slug }
                  : undefined,
              }
            : undefined,
          member: r.member
            ? {
                id: r.member.id,
                name: r.member.name,
                nickname: r.member.nickname,
                email: maskEmail(r.member.email),
                avatar: r.member.avatar
                  ? {
                      id: String(r.member.avatar.id),
                      fileUrl: buildMemberAvatarFileUrl(r.member.avatar),
                    }
                  : undefined,
              }
            : undefined,
          content: r.content,
          likesCount: r.likesCount,
        }))
      )
    })
  )

  router.get(
    '/post-essay-questions/:questionId',
    asyncRoute(async (req, res) => {
      const { questionId } = V1PostEssayQuestionAnswersParamsSchema.parse(
        req.params
      )
      const q = V1PostEssayQuestionAnswersQuerySchema.parse(req.query)
      const answerOrderBy = essayAnswerOrderByFromFlat(q.answerOrderBy)
      const question = await prisma.postEssayQuestion.findUnique({
        where: { id: questionId },
        select: {
          id: true,
          title: true,
          hint: true,
          answers: {
            orderBy: answerOrderBy,
            take: q.answerTake,
            skip: q.answerSkip ?? 0,
            select: {
              id: true,
              content: true,
              likesCount: true,
              member: {
                select: {
                  id: true,
                  name: true,
                  nickname: true,
                  email: true,
                  avatar: {
                    select: {
                      id: true,
                      imageFile_id: true,
                      imageFile_extension: true,
                    },
                  },
                },
              },
            },
          },
        },
      })
      if (!question) {
        sendJsonError(res, 404, 'not_found', 'Not found')
        return
      }
      res.json({
        id: String(question.id),
        title: question.title,
        hint: question.hint,
        answers: question.answers.map((a) => ({
          id: String(a.id),
          content: a.content,
          likesCount: a.likesCount,
          member: a.member
            ? {
                id: a.member.id,
                name: a.member.name,
                nickname: a.member.nickname,
                email: maskEmail(a.member.email),
                avatar: a.member.avatar
                  ? {
                      id: String(a.member.avatar.id),
                      fileUrl: buildMemberAvatarFileUrl(a.member.avatar),
                    }
                  : undefined,
              }
            : undefined,
        })),
      })
    })
  )

  router.get(
    '/authors/by-slug/:slug/avatar',
    asyncRoute(async (req, res) => {
      const { slug } = V1AuthorAvatarPathParamsSchema.parse(req.params)
      const author = await prisma.author.findUnique({
        where: { slug },
        select: {
          avatar: {
            select: { imageFile_id: true },
          },
        },
      })
      const fileId = author?.avatar?.imageFile_id
      const tiny = fileId
        ? `${envVar.gcs.origin}/resized/${fileId}-400.webp`
        : ''
      res.json({ tiny })
    })
  )

  return router
}
