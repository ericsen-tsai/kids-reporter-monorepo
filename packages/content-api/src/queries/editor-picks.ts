import { prisma } from '@kids-reporter/db'

import {
  asOrderJson,
  buildPublicPostWhere,
  mapPostCard,
  orderTargetsByOrderJson,
  postCardSelect,
} from '../utils/v1-helpers.js'

/** `GET /v1/editor-picks-settings` */
export async function fetchEditorPicksSettings(take: number, now: Date) {
  const postWhere = buildPublicPostWhere(now)

  const settings = await prisma.editorPicksSetting.findMany({
    take,
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

  return settings.map((s) => {
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
}

/** `GET /v1/popular-keywords` */
export async function fetchPopularKeywords() {
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

  if (!setting) return []

  return orderTargetsByOrderJson(
    setting.popularKeywords,
    asOrderJson(setting.popularKeywordsOrderJson)
  ).map((k) => ({ name: k.name }))
}
