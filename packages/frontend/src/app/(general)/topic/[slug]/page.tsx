import { emitStructured } from '@kids-reporter/logger'
import type { RawDraftContentState } from 'draft-js'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import {
  getProjectDetailContentApi,
  getProjectMetaContentApi,
} from '@/api/content-api/project-by-slug'
import {
  ContentType,
  GENERAL_DESCRIPTION,
  KIDS_URL_ORIGIN,
  OG_SUFFIX,
} from '@/constants'
import TopicSlugModule from '@/modules/topic/slug'
import { TitlePosition } from '@/modules/topic/types'
import { normalizePhoto } from '@/modules/topic/utils'
import { getFormattedDate, getPostSummaries } from '@/utils'
import { getServerTraceHeaders } from '@/utils/trace-context'

function isRawDraftContentState(value: unknown): value is RawDraftContentState {
  if (!value || typeof value !== 'object') return false
  const v = value as { blocks?: unknown; entityMap?: unknown }
  return (
    Array.isArray(v.blocks) && !!v.entityMap && typeof v.entityMap === 'object'
  )
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const slug = params.slug
  const traceHeaders = getServerTraceHeaders(headers())

  const topicMeta = await getProjectMetaContentApi({ slug, traceHeaders })
  if (!topicMeta) {
    emitStructured({
      severity: 'WARNING',
      message: `Topic not found! ${params.slug}`,
    })
  }

  return {
    title: `${topicMeta?.ogTitle ? topicMeta.ogTitle + ' - ' : ''}${OG_SUFFIX}`,
    alternates: {
      canonical: `${KIDS_URL_ORIGIN}/topic/${slug}`,
    },
    openGraph: {
      title: topicMeta?.ogTitle ?? OG_SUFFIX,
      description: topicMeta?.ogDescription ?? GENERAL_DESCRIPTION,
      images: topicMeta?.ogImage?.resized?.small
        ? [topicMeta.ogImage.resized.small]
        : [],
    },
    other: {
      // Since we can't inject <!-- <PageMap>...</PageMap> --> to <head> section with Next metadata API,
      // so handle google seo with extra <meta> tag here, but be awared there are limitations(maximum 50 tags):
      // https://developers.google.com/custom-search/docs/structured_data?hl=zh-tw#limitations
      publishedDate: topicMeta?.publishedDate ?? '',
      contentType: ContentType.TOPIC,
    },
  }
}

export default async function TopicPage({
  params,
}: {
  params: { slug: string }
}) {
  if (!params?.slug) {
    emitStructured({ severity: 'WARNING', message: 'Incorrect topic slug!' })
    notFound()
  }
  const traceHeaders = getServerTraceHeaders(headers())
  const project = await getProjectDetailContentApi({
    slug: params.slug,
    traceHeaders,
  })
  if (!project) {
    emitStructured({ severity: 'WARNING', message: 'Empty topic!' })
    notFound()
  }

  const relatedPosts = getPostSummaries(project?.relatedPostsOrdered ?? [])
  const heroImage = normalizePhoto(project?.heroImage ?? {})
  const mobileHeroImage = project?.mobileHeroImage
    ? normalizePhoto(project.mobileHeroImage)
    : undefined

  return (
    <TopicSlugModule
      title={project.title ?? ''}
      subtitle={project.subtitle ?? ''}
      titlePosition={(project.titlePosition ?? 'center') as TitlePosition}
      backgroundImage={heroImage}
      mobileBgImage={mobileHeroImage}
      publishedDate={getFormattedDate(project.publishedDate ?? '')}
      content={
        isRawDraftContentState(project.content) ? project.content : undefined
      }
      credits={
        isRawDraftContentState(project.credits) ? project.credits : undefined
      }
      relatedPosts={relatedPosts}
    />
  )
}
