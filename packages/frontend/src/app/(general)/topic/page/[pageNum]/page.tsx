import type { GetProjectsQuery } from '__generated__/operations/content.generated'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getCallBaodaozaiIntroContent } from '@/api/call-baodaozai-intro'
import { FALLBACK_IMG, GENERAL_DESCRIPTION, POST_PER_PAGE } from '@/constants'
import TopicAllModule from '@/modules/topic/all'
import { TopicSummary } from '@/modules/topic/types'
import { getPostSummaries, log, LogLevel } from '@/utils'
import { sendRestGqlRequest } from '@/utils/send-rest-gql'

export const metadata: Metadata = {
  title: '彙整: 專題 - 少年報導者 The Reporter for Kids',
  description: GENERAL_DESCRIPTION,
}

export default async function Topic({
  params: { pageNum },
}: {
  params: { pageNum: string }
}) {
  if (!pageNum) {
    log(LogLevel.WARNING, `Incorrect routing path! ${pageNum}`)
    notFound()
  }

  if (isNaN(Number(pageNum))) {
    log(LogLevel.WARNING, `Incorrect page number! ${pageNum}`)
    notFound()
  }

  const currentPage = Number(pageNum)

  const [projectsRes, topicsIntroContentRes] = await Promise.allSettled([
    // Fetch projects of specific page
    sendRestGqlRequest<GetProjectsQuery>({
      operation: 'projects-paged',
      method: 'GET',
      variables: {
        orderBy: [
          {
            publishedDate: 'desc',
          },
        ],
        take: POST_PER_PAGE,
        skip: (currentPage - 1) * POST_PER_PAGE,
        includeRelatedPosts: currentPage === 1,
      },
    }),
    getCallBaodaozaiIntroContent({ where: { page: 'topics' } }),
  ])
  if (projectsRes.status === 'rejected') {
    log(LogLevel.WARNING, 'Empty topic response!')
    notFound()
  }

  const projects = projectsRes.value
  const topics = projects?.data?.data?.projects
  const topicsCount = projects?.data?.data?.projectsCount ?? 0
  const totalPages = Math.ceil(topicsCount / POST_PER_PAGE)
  if (currentPage > 1 && currentPage > totalPages) {
    log(
      LogLevel.WARNING,
      `Request page(${currentPage}) exceeds total pages(${totalPages})!`
    )
    notFound()
  }

  const topicSummaries: (TopicSummary | undefined)[] = Array.isArray(topics)
    ? topics.map((topic) => {
        return topic
          ? {
              image: topic.heroImage?.resized?.medium ?? FALLBACK_IMG,
              title: topic.title ?? '',
              url: `/topic/${topic.slug}`,
              desc: topic.ogDescription ?? '',
              publishedDate: topic.publishedDate ?? '',
              relatedPosts: topic.relatedPostsOrdered ?? [],
            }
          : undefined
      })
    : []

  const featuredTopic =
    currentPage === 1 && topicSummaries?.[0] ? topicSummaries[0] : null
  const featuredTopicPosts =
    featuredTopic?.relatedPosts &&
    getPostSummaries(featuredTopic.relatedPosts.filter((post) => post))

  // If has featuredTopic, list topics like [featuredTopic(topicSummaries[0])], topicSummaries[1], topicSummaries[2]...
  const topicsForListing = featuredTopic
    ? topicSummaries.slice(1)
    : topicSummaries

  const topicsIntroContent =
    topicsIntroContentRes.status === 'fulfilled'
      ? topicsIntroContentRes.value
      : ''

  return (
    <TopicAllModule
      topicsIntroContent={topicsIntroContent ?? ''}
      featuredTopic={featuredTopic}
      featuredTopicPosts={featuredTopicPosts ?? []}
      topicsForListing={
        topicsForListing?.filter((topic) => topic !== undefined) ?? []
      }
      totalPages={totalPages}
      currentPage={currentPage}
    />
  )
}
