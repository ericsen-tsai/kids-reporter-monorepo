'use client'
import 'swiper/css'

import Image from 'next/image'
import { useRef } from 'react'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperCore } from 'swiper/types'

import SwiperButton from './swiper-button'
import TopicCard from './topic-card'
import WaveIllustrations from './wave-illustrations'

type TopicSliderProp = {
  topics: { url: string; image: string; title: string; subtitle: string }[]
}

function TopicSlider({ topics }: TopicSliderProp) {
  const swiperRef = useRef<SwiperCore>()
  const topicNum = topics?.length

  if (!topicNum || topicNum === 0) {
    return null
  }

  return (
    <div className="relative flex w-screen flex-col items-center justify-center bg-neutral-200 pt-6 pb-6 tablet:pb-20 desktop:pt-10 desktop:pb-24 hd:pt-12 hd:pb-30">
      <div className="relative z-2 flex w-full flex-row items-center justify-center">
        <Swiper
          className="h-full !w-full"
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper
          }}
          modules={[Navigation]}
          loop
          rewind
          slidesPerView={1}
          spaceBetween={20}
          centeredSlides
          breakpoints={{
            768: {
              slidesPerView: 'auto',
              spaceBetween: 32,
            },
            1024: {
              slidesPerView: 'auto',
              spaceBetween: 48,
            },
            1440: {
              slidesPerView: 'auto',
              spaceBetween: 56,
            },
          }}
        >
          {topics.map((topic) => {
            return (
              <SwiperSlide key={topic.title} className="!h-auto tablet:!w-auto">
                <TopicCard
                  url={topic.url}
                  image={topic.image}
                  title={topic.title}
                  subtitle={topic.subtitle}
                />
              </SwiperSlide>
            )
          })}
        </Swiper>
        <SwiperButton
          variant="prev"
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute top-26 left-0 z-[900] -translate-y-1/2 scale-[0.625] tablet:top-42 tablet:left-[calc(50%-320px)] tablet:-translate-x-1/2 desktop:top-56 desktop:left-[calc(50%-416px)] desktop:scale-100 hd:top-64 hd:left-[calc(50%-544px)] hd:scale-100"
        />
        <SwiperButton
          variant="next"
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute top-26 right-0 z-[900] -translate-y-1/2 scale-[0.625] tablet:top-42 tablet:right-[calc(50%-320px)] tablet:translate-x-1/2 desktop:top-56 desktop:right-[calc(50%-416px)] desktop:scale-100 hd:top-64 hd:right-[calc(50%-544px)] hd:scale-100"
        />
      </div>
      <WaveIllustrations />
      <Image
        src="/assets/images/home/topic_baodaozai_illustration_s.svg"
        alt="topic baodaozai illustration"
        width={200}
        height={100}
        className="absolute right-4 bottom-10 z-4 tablet:hidden"
      />
      <Image
        src="/assets/images/home/topic_baodaozai_illustration_m.svg"
        alt="topic baodaozai illustration"
        width={256}
        height={128}
        className="absolute bottom-0 left-22 z-4 hidden tablet:block desktop:hidden"
      />
      <Image
        src="/assets/images/home/topic_baodaozai_illustration_l.svg"
        alt="topic baodaozai illustration"
        width={336}
        height={168}
        className="absolute bottom-0 left-34 z-4 hidden desktop:block hd:hidden"
      />
      <Image
        src="/assets/images/home/topic_baodaozai_illustration_l.svg"
        alt="topic baodaozai illustration"
        width={336}
        height={168}
        className="absolute bottom-0 left-[max(232px,10vw)] z-4 hidden hd:block"
      />
    </div>
  )
}

export default TopicSlider
