import { HeaderPostTitleSetter } from '@kids-reporter/routing-ui'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getPost, getPostMeta } from '@/api/post'
import {
  ContentType,
  GENERAL_DESCRIPTION,
  KIDS_URL_ORIGIN,
  OG_SUFFIX,
} from '@/constants'
import { BAODAOZAI_QUESTION_COUNT } from '@/constants/baodaozai-question-count'
import TableOfContentSideMenu from '@/modules/article/components/table-of-content-side-menu'
import { log, LogLevel } from '@/utils'

import Article from '../../_components/article/article'

const topicRelatedPostsNum = 5
const postEssayQuestionsTake = BAODAOZAI_QUESTION_COUNT
const postChoiceQuestionsTake = BAODAOZAI_QUESTION_COUNT

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const slug = params.slug

  const postMeta = await getPostMeta({
    where: {
      slug: slug,
    },
  })

  if (!postMeta) {
    log(LogLevel.WARNING, `Post meta not found! ${params.slug}`)
  }

  return {
    title: `${postMeta?.ogTitle ? postMeta.ogTitle + ' - ' : ''}${OG_SUFFIX}`,
    alternates: {
      canonical: `${KIDS_URL_ORIGIN}/article/${slug}`,
    },
    openGraph: {
      title: postMeta?.ogTitle ?? OG_SUFFIX,
      description: postMeta?.ogDescription ?? GENERAL_DESCRIPTION,
      images: postMeta?.ogImage?.resized?.small
        ? [postMeta.ogImage.resized.small]
        : [],
      type: ContentType.ARTICLE,
    },
    other: {
      // Since we can't inject <!-- <PageMap>...</PageMap> --> to <head> section with Next metadata API,
      // so handle google seo with extra <meta> tag here, but be awared there are limitations(maximum 50 tags):
      // https://developers.google.com/custom-search/docs/structured_data?hl=zh-tw#limitations
      publishedDate: postMeta?.publishedDate ?? '',
      category:
        postMeta?.subSubcategoriesOrdered?.[0]?.subcategory?.category?.name ??
        '',
      subcategory:
        postMeta?.subSubcategoriesOrdered?.[0]?.subcategory?.name ?? '',
      subSubcategory: postMeta?.subSubcategoriesOrdered?.[0]?.name ?? '',
      contentType: ContentType.ARTICLE,
    },
  }
}

export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  const slug = params.slug
  if (!slug) {
    log(LogLevel.WARNING, 'Invalid post slug!')
    notFound()
  }

  const post = await getPost({
    where: {
      slug: slug,
    },
    relatedPostsWhere: {
      slug: {
        notIn: [slug],
      },
    },
    orderBy: [{ order: 'asc' }],
    take: topicRelatedPostsNum,
    postEssayQuestionsTake,
    postChoiceQuestionsTake,
  })
  if (!post) {
    log(LogLevel.WARNING, `Post not found! ${slug}`)
    notFound()
  }

  // Traverse entityMap to find indexes of TOC
  const entityMap = post.content?.entityMap
  const tocIndexes: { key: string; label: string }[] = []
  Object.keys(entityMap)?.forEach((key) => {
    const entity = entityMap[key]
    const data = entity?.data
    if (entity && entity.type === 'TOC_ANCHOR' && data?.anchorKey) {
      tocIndexes.push({
        key: data.anchorKey,
        label: data.anchorLabel ?? '',
      })
    }
  })

  return (
    <main className="mx-auto flex max-w-(--breakpoint-2xl) flex-col items-center">
      <HeaderPostTitleSetter postTitle={post?.title} />
      {tocIndexes.length > 0 && <TableOfContentSideMenu indexes={tocIndexes} />}
      {post && <Article post={post} slug={slug} />}
    </main>
  )
}
