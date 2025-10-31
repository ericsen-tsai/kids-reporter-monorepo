import { Header } from '@kids-reporter/routing-ui'
import { Metadata } from 'next'
import { Fragment } from 'react'

import { getCallBaodaozaiIntroContent } from '@/api/call-baodaozai-intro'
import { getCategoryPosts } from '@/api/category'
import { getEditorPicksSettings } from '@/api/editor-picks-settings'
import { getLatestPosts } from '@/api/post'
import { getTopicProjects } from '@/api/project'
import { getSubcategoryPosts } from '@/api/subcategory'
import AllSiteBaodaozaiEventTrigger from '@/components/all-site-baodaozai-event-trigger'
import ScrollUpBaodaozaiEventTrigger from '@/components/scroll-up-baodaozai-event-trigger'
import {
  ADDITIONAL_MENU_ITEMS,
  DONATE_URL,
  FALLBACK_IMG,
  GENERAL_DESCRIPTION,
  MENU_ITEMS,
  SEARCH_PLACEHOLDER,
  SECTIONS,
  SOCIAL_MEDIA_ITEMS,
  SUBSCRIBE_URL,
} from '@/constants'
import CallToAction from '@/home/call-to-action'
import Divider from '@/home/divider'
import GoToMainSite from '@/home/go-to-main-site'
import MainSlider from '@/home/main-slider'
import MakeFriends from '@/home/make-friend'
import PostSelection from '@/home/post-selection'
import SearchAndTags from '@/home/search-and-tags'
import Section from '@/home/section'
import { Baodaozai, CallBaodaozaiProvider } from '@/services/call-baodaozai'
import { getPostSummaries } from '@/utils'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '少年報導者 The Reporter for Kids - 理解世界 參與未來',
  description: GENERAL_DESCRIPTION,
}

export default async function Home() {
  const serverRenderTime = new Date().toISOString()
  console.log('Server re-render at:', serverRenderTime)

  const [topicProjects, latestPostsData, editorPicksSettings, introContent] =
    await Promise.all([
      getTopicProjects({
        orderBy: [{ publishedDate: 'desc' }],
        take: 9,
      }),
      getLatestPosts({
        orderBy: [{ publishedDate: 'desc' }],
        take: 6,
      }),
      getEditorPicksSettings({
        take: 5,
      }),
      getCallBaodaozaiIntroContent({ where: { page: 'home' } }),
    ])

  const topics =
    topicProjects?.map((project) => {
      return {
        url: `/topic/${project.slug}`,
        image: project.heroImage?.resized?.small ?? FALLBACK_IMG,
        title: project.title ?? '',
        subtitle: project.subtitle ?? '',
      }
    }) ?? []

  const latestPosts = getPostSummaries(latestPostsData ?? [])

  const firstEditorPicksSettings = editorPicksSettings?.[0]

  const featuredPosts =
    getPostSummaries(
      firstEditorPicksSettings?.editorPicksOfPostsOrdered ?? []
    ) ?? []
  const tags = (firstEditorPicksSettings?.editorPicksOfTags ?? []).map(
    (tag) => ({
      name: tag?.name ?? '',
      slug: tag?.slug ?? '',
    })
  )

  // 4. Fetch posts for each section
  const sectionPostsArray = await Promise.all(
    SECTIONS.map(async (sectionConfig) => {
      // Get category/subcategory name from link.
      // ex: '/category/listening-news/' => split to ['category', 'listening-news'] => pop 'listening-news'
      const categoryTokens = sectionConfig.link
        .replace(/(^\/)|(\/$)/g, '')
        .split('/')
      const isSubcategory = categoryTokens.length === 3
      const slug = categoryTokens.pop()

      if (!slug) return []
      const requestFn = isSubcategory ? getSubcategoryPosts : getCategoryPosts
      const posts = await requestFn({
        where: { slug },
        take: 6,
      })

      return getPostSummaries(posts)
    })
  )

  return (
    <CallBaodaozaiProvider>
      <main className="flex w-screen flex-col items-center">
        <Header
          menuItems={MENU_ITEMS}
          additionalMenuItems={ADDITIONAL_MENU_ITEMS}
          socialMediaHrefs={SOCIAL_MEDIA_ITEMS.map((item) => item.href)}
          searchPlaceholder={SEARCH_PLACEHOLDER}
          subscribeUrl={SUBSCRIBE_URL}
          donateUrl={DONATE_URL}
        />
        <AllSiteBaodaozaiEventTrigger id="show-intro" content={introContent} />
        <div className="relative">
          <div className="absolute top-[150vh]">
            <AllSiteBaodaozaiEventTrigger id="hide-intro" />
          </div>
        </div>
        {topics?.length > 0 && <MainSlider topics={topics} />}
        <PostSelection
          latestPosts={latestPosts}
          featuredPosts={featuredPosts}
        />
        {SECTIONS.map((sectionConfig, index) => {
          const posts = sectionPostsArray?.[index]
          if (!posts) return null
          return (
            <Fragment key={sectionConfig.title}>
              <Section config={sectionConfig} posts={posts} />
              {index < SECTIONS.length - 1 ? <Divider /> : null}
            </Fragment>
          )
        })}
        <SearchAndTags tags={tags} />
        <MakeFriends />
        <CallToAction />
        <GoToMainSite />
        <Baodaozai />
        <ScrollUpBaodaozaiEventTrigger />
      </main>
    </CallBaodaozaiProvider>
  )
}
