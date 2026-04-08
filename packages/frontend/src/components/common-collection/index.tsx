'use client'

import { Button } from '@kids-reporter/routing-ui'
import Image from 'next/image'
import type { ReactNode } from 'react'

import Pagination from '../pagination'
import { PostSummary } from '../types'
import CommonCollectionPostCard from './post-card'

type CommonCollectionProps = {
  title: string
  illustration: string
  illustrationSmall: string
  posts: PostSummary[]
  subcategoryNav?: ReactNode
} & (
  | {
      morePostsMode: 'pagination'
      totalPages: number
      currentPage: number
      routingPrefix: string
    }
  | {
      morePostsMode: 'loadingMore'
      onLoadMore: () => void
      isLoading: boolean
      hasMore: boolean
    }
)

function CommonCollection(props: CommonCollectionProps) {
  const {
    title,
    illustration,
    illustrationSmall,
    morePostsMode,
    posts,
    subcategoryNav,
  } = props
  return (
    <div className="w-screen bg-neutral-100 pb-14 tablet:pb-16 desktop:pb-24 hd:pb-30">
      <div className="mx-auto flex w-full flex-col items-center justify-center px-6 tablet:px-8 desktop:px-12 hd:max-w-300 hd:px-0">
        <div className="relative mb-5 flex w-full flex-col items-center justify-center tablet:flex-row tablet:justify-between hd:mb-10 hd:px-14">
          <div className="relative z-2 mt-6 flex items-center gap-4 self-start tablet:mt-16 desktop:mt-20 desktop:gap-5 hd:mt-24">
            <div className="h-10 w-1 rounded-[8px] bg-red-400 desktop:h-12 desktop:w-3" />
            <h1 className="prose-h1-small font-swei! text-neutral-900 desktop:prose-h1-large">
              {title}
            </h1>
          </div>
          <Image
            alt={`${title} illustration`}
            width={404}
            height={280}
            className="relative z-2 hidden h-[220px] w-[318px] tablet:mt-[10px] tablet:block tablet:h-[280px] tablet:w-[404px] desktop:mt-0 desktop:h-[360px] desktop:w-[520px]"
            src={illustration}
          />
          <Image
            alt={`${title} illustration`}
            width={318}
            height={220}
            className="relative z-2 h-[220px] w-[318px] tablet:hidden"
            src={illustrationSmall}
          />

          <div className="absolute top-0 left-1/2 z-1 h-full w-screen -translate-x-1/2 bg-neutral-white"></div>

          <div className="absolute bottom-0 left-1/2 z-3 h-16 w-screen -translate-x-1/2 bg-[url(/assets/images/common-collection/wave_s.svg)] bg-[length:375px_64px] bg-center bg-repeat-x tablet:hidden" />
          <div className="absolute bottom-0 left-1/2 z-3 hidden h-[114px] w-screen -translate-x-1/2 bg-[url(/assets/images/common-collection/wave_m.svg)] bg-[length:768px_114px] bg-center bg-repeat-x tablet:block desktop:hidden" />
          <div className="absolute bottom-0 left-1/2 z-3 hidden h-[120px] w-screen -translate-x-1/2 bg-[url(/assets/images/common-collection/wave_l.svg)] bg-[length:1024px_120px] bg-center bg-repeat-x desktop:block hd:hidden" />
          <div className="absolute bottom-0 left-1/2 z-3 hidden h-[120px] w-screen -translate-x-1/2 bg-[url(/assets/images/common-collection/wave_xl.svg)] bg-[length:1440px_120px] bg-center bg-repeat-x hd:block" />
        </div>

        {subcategoryNav != null && (
          <div className="mb-14 w-full px-6 tablet:px-8 desktop:px-12 hd:max-w-300 hd:px-0">
            <div className="hd:px-14">{subcategoryNav}</div>
          </div>
        )}

        <div className="px-6 tablet:px-8 desktop:px-12 hd:max-w-300 hd:px-0">
          <div className="grid w-full grid-cols-1 gap-y-6 tablet:grid-cols-2 tablet:gap-x-6 tablet:gap-y-8 desktop:grid-cols-3 desktop:gap-x-8 desktop:gap-y-10 hd:gap-y-14 hd:px-14">
            {posts.map((post) => (
              <CommonCollectionPostCard key={post.url} post={post} />
            ))}
          </div>
        </div>

        {morePostsMode === 'pagination' && props.totalPages > 0 && (
          <Pagination
            className="mt-6 tablet:mt-8 desktop:mt-10 hd:mt-14"
            currentPage={props.currentPage}
            totalPages={props.totalPages}
            routingPrefix={props.routingPrefix}
          />
        )}
        {morePostsMode === 'loadingMore' && props.hasMore && (
          <Button
            onClick={props.onLoadMore}
            disabled={props.isLoading}
            variant="secondary"
            size={44}
            className="mt-6 w-[300px] tablet:mt-8 tablet:w-[200px] desktop:mt-10 desktop:w-[240px] hd:mt-14"
          >
            載入更多
          </Button>
        )}
      </div>
    </div>
  )
}

export default CommonCollection
