'use client'

import { PostSummary } from '@/components/types'

import { CallToAction } from './call-to-action'
import EditorRecommendation from './components/editor-recommendation'
import LatestArticles from './components/latest-articles'
import SubcategoriesMarquee from './components/subcategories-marquee'
import TopicSlider from './components/topic-slider'
import GoToMainSite from './go-to-main-site'
import MakeFriends from './make-friend'
import SearchAndTags from './search-and-tags'

type HomeModuleProps = {
  topics: { url: string; image: string; title: string; subtitle: string }[]
  latestPosts: PostSummary[]
  featuredPosts: PostSummary[]
  tags: { name: string; slug: string }[]
}

function HomeModule({
  topics,
  latestPosts,
  featuredPosts,
  tags,
}: HomeModuleProps) {
  return (
    <>
      <TopicSlider topics={topics} />
      <EditorRecommendation posts={featuredPosts} />
      <LatestArticles posts={latestPosts} />
      <SubcategoriesMarquee />

      <SearchAndTags tags={tags} />
      <MakeFriends />
      <CallToAction />
      <GoToMainSite />
    </>
  )
}

export default HomeModule
