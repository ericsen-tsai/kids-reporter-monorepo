import type { PostContent } from '@kids-reporter/api-types'

export type TitlePosition =
  | 'center'
  | 'center-bottom'
  | 'left-center'
  | 'left-bottom'

export type TopicSummary = {
  image: string
  title: string
  url: string
  desc: string
  publishedDate: string
  relatedPosts?: PostContent[]
}
