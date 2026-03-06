'use client'

import { Button, cn } from '@kids-reporter/routing-ui'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'

import AllSiteBaodaozaiEventTrigger from '@/components/all-site-baodaozai-event-trigger'
import Pagination from '@/components/pagination'
import { PostSummary } from '@/components/types'
import { FALLBACK_IMG, TOPIC_PAGE_ROUTE } from '@/constants'
import useAllSiteBaodaozaiIdleTimer from '@/hooks/use-site-baodaozai-idle-timer'
import { ArrowRight } from '@/icons/arrow'
import { BaodaozaiVisibilitySetter } from '@/services/call-baodaozai'
import { getFormattedDate } from '@/utils'

import TopicPostSlider from '../components/topic-post-slider'
import { TopicSummary } from '../types'

function FeaturedTopicCard({
  topic,
  articleCount,
}: {
  topic: TopicSummary
  articleCount: number
}) {
  const dateStr = getFormattedDate(topic.publishedDate) ?? ''
  const metaText = `${dateStr} 最後更新｜共 ${articleCount} 篇文章`
  return (
    <div className="relative h-[300px] w-full overflow-hidden rounded-t-[30px] tablet:h-[360px] tablet:rounded-[30px]">
      <ImageWithFallback
        className="absolute inset-0 h-full w-full object-cover"
        src={topic.image ?? FALLBACK_IMG}
        loading="lazy"
      />
      <p
        className="text-p2 absolute top-5 left-5 leading-[1.6] font-medium tracking-[0.07em] text-white tablet:top-[34px] tablet:left-8 desktop:top-8 desktop:left-8"
        style={{ textShadow: '0px 2px 10px rgba(0,0,0,0.6)' }}
      >
        {metaText}
      </p>
      <div
        className="absolute right-0 bottom-0 left-0 h-36 bg-linear-to-t from-black/50 to-transparent tablet:h-[168px]"
        aria-hidden
      />
      <div className="absolute right-5 bottom-5 left-5 flex flex-col gap-2 tablet:right-8 tablet:bottom-8 tablet:left-8 desktop:right-8 desktop:bottom-8 desktop:left-8">
        <h2
          className="prose-h3-small font-swei text-white tablet:prose-h3-large"
          style={{ textShadow: '0px 2px 10px rgba(0,0,0,0.6)' }}
        >
          {topic.title}
        </h2>
        <div className="flex items-center gap-4 tablet:gap-8">
          <p
            className="line-clamp-3 min-w-0 flex-1 prose-p1 text-white"
            style={{ textShadow: '0px 2px 10px rgba(0,0,0,0.6)' }}
          >
            {topic.desc}
          </p>
          <Button
            className="size-11 shrink-0 rounded-full border-2 border-neutral-white p-0"
            asChild
          >
            <Link href={topic.url}>
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

const ImageWithFallback = dynamic(
  () => import('@/components/image-with-fallback'),
  { ssr: false }
)

const TopicCard = (props: { topic: TopicSummary }) => {
  const moreComponent = (
    <div className={`rpjr-btn rpjr-btn-theme-outline theme-blue`}>
      看更多文章 <i className="icon-rpjr-icon-arrow-right"></i>
    </div>
  )

  const topic = props.topic
  return (
    <Link href={topic.url}>
      <div className="relative flex flex-col items-stretch lg:flex-row">
        <div>
          <ImageWithFallback
            className="h-full w-full object-cover align-middle"
            src={topic.image ?? FALLBACK_IMG}
            loading="lazy"
          />
        </div>
        <div
          style={{ width: 'fit-content', height: 'fit-content', zIndex: '2' }}
          className="absolute top-5 left-5 flex flex-row items-center gap-1 rounded-3xl bg-white px-4 py-1 lg:hidden"
        >
          <img
            className="w-10"
            src={'/assets/images/topic_icon.svg'}
            loading="lazy"
          />
          <span
            style={{ lineHeight: '160%', letterSpacing: '0.08em' }}
            className="text-xl font-bold"
          >
            專題
          </span>
        </div>
        <div
          className={`flex flex-col items-start justify-between border-solid border-gray-300 bg-white`}
        >
          <div className="hidden w-full flex-row items-center gap-1 lg:flex">
            <img
              className="max-w-10"
              src={'/assets/images/topic_icon.svg'}
              loading="lazy"
            />
            <span
              style={{ lineHeight: '160%', letterSpacing: '0.08em' }}
              className="text-xl font-bold"
            >
              專題
            </span>
          </div>
          <p
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: '2',
              lineHeight: '160%',
              letterSpacing: '0.08em',
            }}
            className="mb-4 overflow-hidden text-2xl font-bold"
          >
            {topic.title}
          </p>
          <p
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: '5',
              lineHeight: '160%',
              letterSpacing: '0.08em',
            }}
            className="mb-4 overflow-hidden text-base font-normal"
          >
            {topic.desc}
          </p>
          <div className="flex w-full flex-row items-end justify-between">
            <p className="text-base font-medium tracking-wider text-gray-500">
              {getFormattedDate(topic.publishedDate) ?? ''} 最後更新
            </p>
            {moreComponent}
          </div>
        </div>
      </div>
    </Link>
  )
}

type TopicAllModuleProps = {
  topicsIntroContent: string
  featuredTopic: TopicSummary | null
  featuredTopicPosts: PostSummary[]
  topicsForListing: TopicSummary[] | null
  totalPages: number
  currentPage: number
}

function TopicAllModule({
  topicsIntroContent,
  featuredTopic,
  featuredTopicPosts,
  topicsForListing,
  totalPages,
  currentPage,
}: TopicAllModuleProps) {
  const { isIdle: isAllSiteBaodaozaiIdle } = useAllSiteBaodaozaiIdleTimer()
  return (
    <main className="mx-auto flex flex-col items-center justify-center">
      <BaodaozaiVisibilitySetter show={true} />
      <AllSiteBaodaozaiEventTrigger
        id="show-intro"
        content={topicsIntroContent}
        isIdle={isAllSiteBaodaozaiIdle}
      />
      <div className="relative">
        <div className="absolute top-[150vh]">
          <AllSiteBaodaozaiEventTrigger
            id="hide-intro"
            isIdle={isAllSiteBaodaozaiIdle}
            content={topicsIntroContent}
          />
        </div>
      </div>
      <div className="w-screen bg-neutral-100">
        <div className="mx-auto flex w-full flex-col items-center justify-center gap-10 px-6 tablet:px-8 desktop:px-12 hd:max-w-300 hd:px-0">
          <div className="relative flex w-full flex-col items-center justify-center tablet:flex-row tablet:justify-between hd:px-14">
            <div className="relative z-2 mt-6 flex items-center gap-4 self-start tablet:mt-16 desktop:mt-20 desktop:gap-5 hd:mt-24">
              <div className="h-10 w-1 rounded-[8px] bg-red-400 desktop:h-12 desktop:w-3" />
              <h1 className="prose-h1-small font-swei! text-neutral-900 desktop:prose-h1-large">
                專題
              </h1>
            </div>
            <Image
              alt="topic illustration"
              width={318}
              height={220}
              className="relative z-2 h-[220px] w-[318px] tablet:mt-[10px] tablet:h-[280px] tablet:w-[404px] desktop:mt-0 desktop:h-[360px] desktop:w-[520px]"
              src="/assets/images/topic/illustration.svg"
            />

            <div className="absolute top-0 left-1/2 z-1 h-full w-screen -translate-x-1/2 bg-neutral-white"></div>

            <div className="absolute bottom-0 left-1/2 z-3 h-16 w-screen -translate-x-1/2 bg-[url(/assets/images/topic/wave_s.svg)] bg-[length:375px_64px] bg-center bg-repeat-x tablet:hidden" />
            <div className="absolute bottom-0 left-1/2 z-3 hidden h-[114px] w-screen -translate-x-1/2 bg-[url(/assets/images/topic/wave_m.svg)] bg-[length:768px_114px] bg-center bg-repeat-x tablet:block desktop:hidden" />
            <div className="absolute bottom-0 left-1/2 z-3 hidden h-[120px] w-screen -translate-x-1/2 bg-[url(/assets/images/topic/wave_l.svg)] bg-[length:1024px_120px] bg-center bg-repeat-x desktop:block hd:hidden" />
            <div className="absolute bottom-0 left-1/2 z-3 hidden h-[120px] w-screen -translate-x-1/2 bg-[url(/assets/images/topic/wave_xl.svg)] bg-[length:1440px_120px] bg-center bg-repeat-x hd:block" />
          </div>
          <div className="w-full hd:px-4">
            {featuredTopic && (
              <div
                className={cn(
                  'grid w-full grid-cols-1 rounded-[30px] bg-white tablet:gap-6 tablet:rounded-[56px] tablet:p-6 desktop:gap-x-8 desktop:gap-y-8 desktop:rounded-[56px] desktop:p-8 hd:gap-x-8 hd:gap-y-8 hd:p-10',
                  {
                    'desktop:grid-cols-10':
                      featuredTopicPosts && featuredTopicPosts.length > 0,
                    'desktop:grid-cols-1':
                      featuredTopicPosts && featuredTopicPosts.length === 0,
                  }
                )}
              >
                <div
                  className={cn('desktop:col-span-6', {
                    'desktop:col-span-1':
                      featuredTopicPosts && featuredTopicPosts.length === 0,
                  })}
                >
                  <FeaturedTopicCard
                    topic={featuredTopic}
                    articleCount={featuredTopicPosts?.length ?? 0}
                  />
                </div>
                {featuredTopicPosts && featuredTopicPosts.length > 0 && (
                  <div className="flex flex-col gap-5 p-5 tablet:p-0 desktop:col-span-4">
                    <TopicPostSlider posts={featuredTopicPosts} />
                  </div>
                )}
              </div>
            )}
          </div>

          {topicsForListing && topicsForListing.length > 0 && (
            <div className="flex w-full flex-col items-center justify-center gap-10">
              {topicsForListing.map((topic, index) => {
                return (
                  topic && (
                    <TopicCard key={`topic-card-${index}`} topic={topic} />
                  )
                )
              })}
            </div>
          )}
          {totalPages && totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              routingPrefix={TOPIC_PAGE_ROUTE}
            />
          )}
        </div>
      </div>
    </main>
  )
}

export default TopicAllModule
