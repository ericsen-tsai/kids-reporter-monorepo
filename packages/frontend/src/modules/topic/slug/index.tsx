import { HeaderPostTitleSetter } from '@kids-reporter/routing-ui'
import { RawDraftContentState } from 'draft-js'

import { Content } from '@/app/(general)/_components/topic/content'
import { Credits } from '@/app/(general)/_components/topic/credits'
import Leading from '@/app/(general)/_components/topic/leading'
import { RelatedPosts } from '@/app/(general)/_components/topic/related-posts'
import { PublishedDate } from '@/app/(general)/_components/topic/styled'
import { PostSummary } from '@/components/types'
import { Theme } from '@/constants'
import { Photo } from '@/types'
import { getFormattedDate } from '@/utils'

import { TitlePosition } from '../types'

type TopicSlugModuleProps = {
  title: string
  subtitle: string
  titlePosition: TitlePosition
  backgroundImage: Photo
  mobileBgImage?: Photo
  publishedDate: string
  content: RawDraftContentState
  credits: RawDraftContentState
  relatedPosts: PostSummary[]
}

function TopicSlugModule({
  title,
  subtitle,
  titlePosition,
  backgroundImage,
  mobileBgImage,
  publishedDate,
  content,
  credits,
  relatedPosts,
}: TopicSlugModuleProps) {
  return (
    <div>
      <HeaderPostTitleSetter postTitle={title} />
      <Leading
        title={title}
        subtitle={subtitle}
        titlePosition={titlePosition}
        backgroundImage={backgroundImage}
        mobileBgImage={mobileBgImage}
      />
      {publishedDate ? (
        <PublishedDate>
          {getFormattedDate(publishedDate)} 最後更新
        </PublishedDate>
      ) : null}
      {content ? (
        <Content rawContentState={content} theme={Theme.BLUE} />
      ) : null}
      {credits ? (
        <Credits rawContentState={credits} theme={Theme.BLUE} />
      ) : null}
      <RelatedPosts posts={relatedPosts} />
    </div>
  )
}

export default TopicSlugModule
