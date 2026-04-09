'use client'

import { Button } from '@kids-reporter/routing-ui'
import Image from 'next/image'
import type { ReactNode } from 'react'

import Pagination from '../pagination'
import { PostSummary } from '../types'
import CommonCollectionPostCard from './post-card'

type CommonCollectionHero =
  | {
      type: 'illustrated'
      title: string
      illustration: string
      illustrationSmall: string
    }
  | {
      type: 'tag'
      title: string
    }
  | {
      type: 'author'
      name: string
      email?: string
      bio?: string
      avatarUrl: string
    }

type CommonCollectionProps = {
  hero: CommonCollectionHero
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
  const { hero, morePostsMode, posts, subcategoryNav } = props
  return (
    <div className="w-screen bg-neutral-100 pb-14 tablet:pb-16 desktop:pb-24 hd:pb-30">
      <div className="mx-auto flex w-full flex-col items-center justify-center px-6 tablet:px-8 desktop:px-12 hd:max-w-300 hd:px-0">
        {hero.type === 'illustrated' && (
          <div className="relative mb-5 flex w-full flex-col items-center justify-center tablet:flex-row tablet:justify-between hd:mb-10 hd:px-14">
            <div className="relative z-2 mt-6 flex items-center gap-4 self-start tablet:mt-16 desktop:mt-20 desktop:gap-5 hd:mt-24">
              <div className="h-10 w-1 rounded-[8px] bg-red-400 desktop:h-12 desktop:w-3" />
              <h1 className="prose-h1-small font-swei! text-neutral-900 desktop:prose-h1-large">
                {hero.title}
              </h1>
            </div>
            <Image
              alt={`${hero.title} illustration`}
              width={404}
              height={280}
              className="relative z-2 hidden h-[220px] w-[318px] tablet:mt-[10px] tablet:block tablet:h-[280px] tablet:w-[404px] desktop:mt-0 desktop:h-[360px] desktop:w-[520px]"
              src={hero.illustration}
            />
            <Image
              alt={`${hero.title} illustration`}
              width={318}
              height={220}
              className="relative z-2 h-[220px] w-[318px] tablet:hidden"
              src={hero.illustrationSmall}
            />

            <div className="absolute top-0 left-1/2 z-1 h-full w-screen -translate-x-1/2 bg-neutral-white"></div>

            <div className="absolute bottom-0 left-1/2 z-3 h-16 w-screen -translate-x-1/2 bg-[url(/assets/images/common-collection/wave_s.svg)] bg-size-[375px_64px] bg-center bg-repeat-x tablet:hidden" />
            <div className="absolute bottom-0 left-1/2 z-3 hidden h-[114px] w-screen -translate-x-1/2 bg-[url(/assets/images/common-collection/wave_m.svg)] bg-size-[768px_114px] bg-center bg-repeat-x tablet:block desktop:hidden" />
            <div className="absolute bottom-0 left-1/2 z-3 hidden h-[120px] w-screen -translate-x-1/2 bg-[url(/assets/images/common-collection/wave_l.svg)] bg-size-[1024px_120px] bg-center bg-repeat-x desktop:block hd:hidden" />
            <div className="absolute bottom-0 left-1/2 z-3 hidden h-[120px] w-screen -translate-x-1/2 bg-[url(/assets/images/common-collection/wave_xl.svg)] bg-size-[1440px_120px] bg-center bg-repeat-x hd:block" />
          </div>
        )}

        {hero.type === 'tag' && (
          <div className="relative mb-5 flex h-[360px] w-full items-start justify-center hd:mb-10">
            <div className="absolute top-0 left-1/2 z-1 h-full w-screen -translate-x-1/2 bg-neutral-white" />
            <h1 className="relative z-2 mt-24 px-6 text-center prose-h1-small font-swei! text-neutral-900 desktop:prose-h1-large">
              {hero.title}
            </h1>

            <div className="absolute bottom-0 left-1/2 z-3 h-16 w-screen -translate-x-1/2 bg-[url(/assets/images/common-collection/wave_s.svg)] bg-size-[375px_64px] bg-center bg-repeat-x tablet:hidden" />
            <div className="absolute bottom-0 left-1/2 z-3 hidden h-[114px] w-screen -translate-x-1/2 bg-[url(/assets/images/common-collection/wave_m.svg)] bg-size-[768px_114px] bg-center bg-repeat-x tablet:block desktop:hidden" />
            <div className="absolute bottom-0 left-1/2 z-3 hidden h-[120px] w-screen -translate-x-1/2 bg-[url(/assets/images/common-collection/wave_l.svg)] bg-size-[1024px_120px] bg-center bg-repeat-x desktop:block hd:hidden" />
            <div className="absolute bottom-0 left-1/2 z-3 hidden h-[120px] w-screen -translate-x-1/2 bg-[url(/assets/images/common-collection/wave_xl.svg)] bg-size-[1440px_120px] bg-center bg-repeat-x hd:block" />
          </div>
        )}

        {hero.type === 'author' && (
          <>
            <div className="relative flex w-full flex-col items-center px-6 pt-12 pb-22 tablet:px-8 tablet:pt-16 tablet:pb-44 desktop:px-12 desktop:pt-20 desktop:pb-50 hd:px-0">
              <div className="absolute top-0 left-1/2 z-1 h-full w-screen -translate-x-1/2 bg-neutral-white" />

              <div className="relative z-2 flex w-full flex-col items-center gap-6 text-center tablet:max-w-[582px] tablet:flex-row tablet:items-start tablet:gap-12 tablet:text-left desktop:max-w-[608px] hd:max-w-[790px]">
                <div className="h-[120px] w-[120px] shrink-0 overflow-hidden tablet:h-[160px] tablet:w-[160px]">
                  <img
                    src={hero.avatarUrl}
                    alt={hero.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex w-full flex-col gap-4">
                  <div className="flex w-full flex-col gap-1">
                    <h1 className="prose-h5-small text-neutral-900 desktop:prose-h5-large">
                      {hero.name}
                    </h1>
                    {hero.email != null && hero.email !== '' && (
                      <a
                        href={`mailto:${hero.email}`}
                        className="prose-p2 text-blue-400 underline decoration-neutral-400 underline-offset-2 desktop:prose-p1"
                      >
                        {hero.email}
                      </a>
                    )}
                  </div>
                  {hero.bio != null && hero.bio !== '' && (
                    <p className="prose-p2 whitespace-pre-wrap text-neutral-900 desktop:prose-p1">
                      {hero.bio}
                    </p>
                  )}
                </div>
              </div>
              <div className="absolute bottom-0 left-1/2 z-3 hidden h-[120px] w-screen -translate-x-1/2 bg-[url(/assets/images/common-collection/wave_xl.svg)] bg-size-[1440px_120px] bg-center bg-repeat-x hd:block" />
              <div className="absolute bottom-0 left-1/2 z-3 hidden h-[120px] w-screen -translate-x-1/2 bg-[url(/assets/images/common-collection/wave_l.svg)] bg-size-[1024px_120px] bg-center bg-repeat-x desktop:block hd:hidden" />
              <div className="absolute bottom-0 left-1/2 z-3 hidden h-[114px] w-screen -translate-x-1/2 bg-[url(/assets/images/common-collection/wave_m.svg)] bg-size-[768px_114px] bg-center bg-repeat-x tablet:block desktop:hidden" />
              <div className="absolute bottom-0 left-1/2 z-3 h-16 w-screen -translate-x-1/2 bg-[url(/assets/images/common-collection/wave_s.svg)] bg-size-[375px_64px] bg-center bg-repeat-x tablet:hidden" />
            </div>
          </>
        )}

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
