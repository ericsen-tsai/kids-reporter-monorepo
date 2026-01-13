import Link from 'next/link'

import PostSlider from '@/components/post-slider'
import { PostSummary } from '@/components/types'
import { DEFAULT_THEME_COLOR, Theme } from '@/constants'

export type SectionConfig = {
  image: string
  titleImg: string
  title: string
  link: string
  theme: Theme
}

type SectionProp = {
  config: SectionConfig
  posts: PostSummary[]
}

export const Section = (props: SectionProp) => {
  const config = props?.config
  const posts = props?.posts
  const theme = props?.config.theme || DEFAULT_THEME_COLOR

  return (
    config && (
      <div
        style={{ width: 'min(var(--normal-container-max-width), 100%)' }}
        className="mb-2 flex flex-col items-center"
      >
        <div
          style={{ width: '95%' }}
          className="mb-12 flex flex-row items-center justify-between pt-10"
        >
          <div style={{ flex: '1' }} className="hidden lg:flex">
            <img
              className="max-w-sm"
              src={`/assets/images/${config.image}`}
              loading="lazy"
            />
          </div>
          <div style={{ flex: '1' }} className="flex flex-row justify-center">
            <img
              className="flex h-24 w-full items-center justify-center"
              src={`/assets/images/${config.titleImg}`}
              alt={config.title}
              loading="lazy"
            />
          </div>
          <div
            style={{ flex: '1' }}
            className="hidden flex-row justify-end md:flex"
          >
            <Link
              href={config.link}
              className={`rpjr-btn rpjr-btn-theme-outline theme-${theme} px-5 pt-2 pb-3 text-xl`}
            >
              看更多文章 <i className="icon-rpjr-icon-arrow-right"></i>
            </Link>
          </div>
        </div>
        {posts?.length > 0 && <PostSlider posts={posts} sliderTheme={theme} />}
        <div style={{ width: '90%' }} className="flex p-2.5 md:hidden">
          <Link
            href={config.link}
            className={`rpjr-btn rpjr-btn-theme-outline theme-${theme} flex w-full flex-row items-center justify-center gap-1 rounded-2xl p-2 text-sm`}
          >
            看更多文章 <i className="icon-rpjr-icon-arrow-right"></i>
          </Link>
        </div>
      </div>
    )
  )
}

export default Section
