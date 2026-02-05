'use client'

import {
  PostEssayAnswerOrderByInput,
  PostOrderByInput,
} from '__generated__/types'
import { memo, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { DEFAULT_PAGE_ITEM_COUNT } from '@/api-utils/react-query/constants'
import { usePostsEssayAnswersWithLikesInfinityQuery } from '@/api-utils/react-query/hooks/post'

import NavBar from './nav-bar'
import PostAnswerCard from './post-answer-card'
import PostAnswerCardSkeleton from './post-answer-card-skeleton'
import { transformInfinitePostsEssayAnswersWithLikesDataToPosts } from './utils'

// try to take more than 2 to show more answers in the post answer card
const ANSWER_TAKE = 3

type AllAnswersProps = {
  onOpenModal: (postSlug: string) => void
}

function AllAnswers({ onOpenModal }: AllAnswersProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const hasShownToastRef = useRef(false)
  const showNavBarRef = useRef(false)
  const [showNavBar, setShowNavBar] = useState(false)
  const {
    data: posts,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = usePostsEssayAnswersWithLikesInfinityQuery({
    orderBy: [{ publishedDate: 'desc' }] as PostOrderByInput[],
    take: DEFAULT_PAGE_ITEM_COUNT,
    answerOrderBy: [{ likesCount: 'desc' }] as PostEssayAnswerOrderByInput[],
    answerTake: ANSWER_TAKE,
    where: {
      postEssayQuestions: {
        some: {
          answers: {
            some: {},
          },
        },
      },
    },
    select: transformInfinitePostsEssayAnswersWithLikesDataToPosts,
  })

  // IntersectionObserver to trigger fetchNextPage
  useEffect(() => {
    const element = loadMoreRef.current
    const scrollContainer = scrollContainerRef.current
    if (!element || !scrollContainer || !hasNextPage || isFetchingNextPage)
      return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
          }
        })
      },
      {
        threshold: 0.1,
        root: scrollContainer,
        rootMargin: '0px 100px 0px 0px',
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  useEffect(() => {
    const handleScroll = () => {
      const title = titleRef.current
      if (!title) return
      const titleRect = title.getBoundingClientRect()
      const threshold = 120
      if (titleRect.top < threshold && !hasShownToastRef.current) {
        toast.success('向左滑動可以看到更多文章喔！', {
          className: 'desktop:!bottom-19',
        })
        hasShownToastRef.current = true
      }

      if (titleRect.top < threshold && !showNavBarRef.current) {
        showNavBarRef.current = true
        setShowNavBar(true)
      }

      if (titleRect.top > threshold && showNavBarRef.current) {
        showNavBarRef.current = false
        setShowNavBar(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const showLoading = isLoading || isFetchingNextPage
  const handleScrollToTop = () => {
    titleRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start',
    })
  }
  return (
    <div className="relative flex w-[calc(100%+48px)] flex-col gap-6 bg-neutral-100 pt-10 pb-12 tablet:w-[calc(100%+64px)] tablet:gap-8 tablet:pt-12 tablet:pb-14 desktop:w-screen desktop:gap-10 desktop:pt-18 desktop:pb-22 hd:w-screen hd:pt-24 hd:pb-28">
      <div
        ref={titleRef}
        className="flex items-center gap-3 pl-6 tablet:pl-8 desktop:pl-12 hd:pl-[calc(50vw-600px+64px)]"
      >
        <div className="h-8 w-1.5 rounded-md bg-blue-400" />
        <h3 className="prose-h3-small font-swei text-neutral-900 desktop:prose-h3-large">
          所有回答
        </h3>
      </div>
      <div
        ref={scrollContainerRef}
        className="flex scrollbar-thin snap-x snap-mandatory scroll-px-6 gap-6 overflow-x-auto px-6 pb-2 tablet:scroll-px-8 tablet:px-8 desktop:scroll-px-12 desktop:gap-8 desktop:px-12 hd:scroll-pr-14 hd:scroll-pl-[calc(50vw-600px+64px)] hd:pr-14 hd:pl-[calc(50vw-600px+64px)]"
      >
        {posts?.map((post, index) => (
          <div
            key={post.id}
            className="shrink-0 snap-start"
            data-card-index={index}
          >
            <PostAnswerCard post={post} onOpenModal={onOpenModal} />
          </div>
        ))}
        {hasNextPage && (
          <div
            ref={loadMoreRef}
            className="h-1 w-1 shrink-0"
            aria-hidden="true"
          />
        )}
        {!isLoading && posts?.length === 0 && (
          <div className="flex w-full items-center justify-center py-12 text-center">
            <p className="prose-p1 text-neutral-500">尚無回答</p>
          </div>
        )}
        {showLoading && (
          <>
            {[1, 2, 3].map((index) => (
              <div
                key={`skeleton-${index}`}
                className="shrink-0 snap-start"
                data-card-index={(posts?.length ?? 0) + index - 1}
              >
                <PostAnswerCardSkeleton />
              </div>
            ))}
          </>
        )}
      </div>
      <NavBar
        scrollContainerRef={scrollContainerRef}
        onScrollToTop={handleScrollToTop}
        showNavBar={showNavBar}
      />
    </div>
  )
}

export default memo(AllAnswers)
