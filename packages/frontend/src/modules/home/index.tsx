'use client'
import { Fragment } from 'react'

import { PostSummary } from '@/components/types'
import { SECTIONS } from '@/constants'

import { CallToAction } from './call-to-action'
import EditorRecommendation from './components/editor-recommendation'
import LatestArticles from './components/latest-articles'
import SubcategoriesMarquee from './components/subcategories-marquee'
import TopicSlider from './components/topic-slider'
import Divider from './divider'
import GoToMainSite from './go-to-main-site'
import MakeFriends from './make-friend'
import SearchAndTags from './search-and-tags'
import Section from './section'

type HomeModuleProps = {
  topics: { url: string; image: string; title: string; subtitle: string }[]
  latestPosts: PostSummary[]
  featuredPosts: PostSummary[]
  sectionPostsArray: PostSummary[][]
  tags: { name: string; slug: string }[]
}

function HomeModule({
  topics,
  latestPosts,
  featuredPosts,
  sectionPostsArray,
  tags,
}: HomeModuleProps) {
  return (
    <>
      <TopicSlider topics={topics} />
      <EditorRecommendation posts={featuredPosts} />
      <LatestArticles posts={latestPosts} />
      <SubcategoriesMarquee />
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
    </>
  )
}

export default HomeModule
