'use client'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './post-slider.css'

import { cn } from '@kids-reporter/routing-ui'
import { useRef } from 'react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperCore } from 'swiper/types'

import PostCard from '@/components/post-card'
import { PostSummary } from '@/components/types'
import { DEFAULT_THEME_COLOR, Theme } from '@/constants'
import { ArrowLeft, ArrowRight } from '@/icons/arrow'
import { getThemeColor } from '@/utils'

export type PostSliderProp = {
  posts: PostSummary[]
  sliderTheme: Theme
  isSimple?: boolean
  enablePagination?: boolean
}

const slidesPerView = 3
const autoPlayInterval = 5000

export const PostSlider = ({
  posts,
  sliderTheme,
  isSimple = false,
  enablePagination = true,
}: PostSliderProp) => {
  const postNum = posts?.length
  const themeColor = getThemeColor(sliderTheme) ?? DEFAULT_THEME_COLOR

  // Note: swiper loop mode is only available when slideNum >= slidesPerView * 2
  // ref: https://swiperjs.com/swiper-api#param-loop
  const isLoopAvailable = postNum >= slidesPerView * 2

  // Note: for swiper custom navigation buttons
  // https://github.com/nolimits4web/swiper/issues/3855#issuecomment-1287871054
  const swiperRef = useRef<SwiperCore>()

  return (
    postNum > 0 && (
      <div
        style={{ width: 'min(var(--normal-container-max-width), 100%)' }}
        className={`mx-auto mb-5 flex flex-col items-center justify-center theme-${sliderTheme}`}
      >
        <div className="relative flex w-full flex-row items-start justify-center">
          {postNum === 1 ? (
            posts[0] && (
              <div className="w-full md:w-1/2 lg:w-1/3">
                <PostCard post={posts[0]} />
              </div>
            )
          ) : (
            <>
              <Swiper
                autoplay={{ delay: autoPlayInterval }}
                onBeforeInit={(swiper) => {
                  swiperRef.current = swiper
                }}
                pagination={{ enabled: enablePagination, clickable: true }}
                modules={[Autoplay, Navigation, Pagination]}
                loop={isLoopAvailable}
                rewind={!isLoopAvailable}
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={{
                  1000: {
                    slidesPerView: postNum > 2 ? 3 : 2,
                  },
                  730: {
                    slidesPerView: 2,
                  },
                }}
              >
                {posts.map((post, index) => {
                  return (
                    post && (
                      <SwiperSlide key={`swiper-slide-${index}`}>
                        <PostCard post={post} isSimple={isSimple} />
                      </SwiperSlide>
                    )
                  )
                })}
              </Swiper>
              <button
                style={{ left: '15px', top: '15%', zIndex: '900' }}
                className={cn(
                  'absolute w-8 cursor-pointer border-none bg-transparent lg:w-14',
                  `text-${themeColor}`
                )}
                onClick={() => swiperRef.current?.slidePrev()}
              >
                <ArrowLeft />
              </button>
              <button
                style={{ right: '15px', top: '15%', zIndex: '900' }}
                className={cn(
                  'absolute w-8 cursor-pointer border-none bg-transparent lg:w-14',
                  `text-${themeColor}`
                )}
                onClick={() => swiperRef.current?.slideNext()}
              >
                <ArrowRight />
              </button>
            </>
          )}
        </div>
      </div>
    )
  )
}

export default PostSlider
