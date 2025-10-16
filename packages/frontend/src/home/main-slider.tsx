'use client'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './main-slider.css'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRef } from 'react'
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperCore } from 'swiper/types'

import { DEFAULT_THEME_COLOR, Theme } from '@/constants'
import { ArrowLeft, ArrowRight } from '@/icons/arrow'

const ImageWithFallback = dynamic(
  () => import('@/components/image-with-fallback'),
  { ssr: false }
)

type SliderProp = {
  topics: { url: string; image: string; title: string; subtitle: string }[]
}

const autoPlayInterval = 5000

export const MainSlider = (props: SliderProp) => {
  const topics = props?.topics
  const swiperRef = useRef<SwiperCore>()

  return (
    <div
      style={{
        backgroundPosition: 'bottom right 15%',
        backgroundSize: '317px',
      }}
      className={`main-slider mr-auto mb-5 ml-auto flex w-screen max-w-7xl flex-col items-center justify-center bg-no-repeat lg:pt-10 theme-${Theme.YELLOW}`}
    >
      <div className="relative flex w-full flex-row items-center justify-center">
        <Swiper
          autoplay={{ delay: autoPlayInterval }}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper
          }}
          pagination={{ clickable: true }}
          modules={[Autoplay, EffectCoverflow, Navigation, Pagination]}
          loop={true}
          slidesPerView={1}
          effect={'coverflow'}
          centeredSlides={true}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 1,
            scale: 0.8,
            slideShadows: false,
          }}
          breakpoints={{
            1000: {
              slidesPerView: 2,
            },
          }}
        >
          {topics.map((topic, index) => {
            return (
              <SwiperSlide key={`swiper-main-slide-${index}`}>
                <Link
                  key={`topic-${index}`}
                  className="relative mb-0 flex max-w-3xl cursor-pointer flex-col justify-center md:mb-16"
                  href={topic.url}
                >
                  <div
                    style={{
                      width: 'fit-content',
                      height: 'fit-content',
                      zIndex: '2',
                    }}
                    className="absolute top-5 left-5 flex flex-row items-center gap-1 rounded-3xl bg-white px-3 py-1 md:px-4"
                  >
                    <img
                      className="w-8 md:w-10"
                      src={'/assets/images/topic_icon.svg'}
                      loading="eager"
                    />
                    <span
                      style={{ lineHeight: '160%', letterSpacing: '0.08em' }}
                      className="text-base font-bold md:text-xl"
                    >
                      專題
                    </span>
                  </div>
                  <div className="flex flex-col justify-center">
                    <div
                      style={{
                        height: 'calc(100% / 16 * 9)',
                        aspectRatio: '16/9',
                      }}
                      className="max-w-full"
                    >
                      <ImageWithFallback
                        className="h-full w-full rounded-none object-cover md:rounded-2xl"
                        src={topic.image}
                        loading="eager"
                        fetchPriority="high"
                      />
                    </div>
                    <span
                      style={{
                        fontFamily:
                          'SweiMarkerSansCJKtc-Regular,noto sans tc,Sans-Serif,serif',
                        lineHeight: '160%',
                        letterSpacing: '.08em',
                      }}
                      className="w-full p-8 text-center text-xl font-bold text-gray-900 not-italic md:text-3xl"
                    >
                      {topic.title}
                      <br />
                      {topic.subtitle}
                    </span>
                  </div>
                </Link>
              </SwiperSlide>
            )
          })}
        </Swiper>
        <button
          className="prev-btn absolute top-1/4 w-14 cursor-pointer border-none bg-transparent"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <ArrowLeft color={DEFAULT_THEME_COLOR} />
        </button>
        <button
          className="next-btn absolute top-1/4 w-14 cursor-pointer border-none bg-transparent"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <ArrowRight color={DEFAULT_THEME_COLOR} />
        </button>
      </div>
    </div>
  )
}

export default MainSlider
