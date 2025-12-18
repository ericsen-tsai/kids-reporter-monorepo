'use client'

import {
  PostEssayAnswerOrderByInput,
  PostOrderByInput,
} from '__generated__/types'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import { usePostsEssayAnswersWithLikesInfinityQuery } from '@/api-utils/react-query/hooks/post'

import { PostWithTwoTopLikesAnswersPerQuestion } from '../types'
import PostAnswerCard from './post-answer-card'
import PostAnswerCardSkeleton from './post-answer-card-skeleton'

const PAGE_SIZE = 5
const ANSWER_TAKE = 2

type AllAnswersProps = {
  onOpenModal: (postSlug: string) => void
}

function AllAnswers({ onOpenModal }: AllAnswersProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const [hasShownToast, setHasShownToast] = useState(false)

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    usePostsEssayAnswersWithLikesInfinityQuery({
      orderBy: [{ publishedDate: 'desc' }] as PostOrderByInput[],
      take: PAGE_SIZE,
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
    })

  // Transform API response to match component expected type
  const posts = useMemo(() => {
    if (!data?.pages) return []

    const allPosts: PostWithTwoTopLikesAnswersPerQuestion['posts'] = []

    data.pages.forEach((page) => {
      if (!page) return

      page.forEach((post) => {
        if (!post) return

        // Filter questions to only include those with answers
        const questionsWithAnswers =
          post.postEssayQuestions
            ?.map((question) => ({
              id: question.id,
              title: question.title || '',
              hint: question.hint || '',
              answers:
                question.answers?.map((answer) => {
                  const member = answer?.member
                  return {
                    id: answer.id,
                    content: answer.content || '',
                    likesCount: answer.likesCount || 0,
                    member: {
                      id: member?.id || '',
                      name: member?.name || '',
                      nickname: member?.nickname || '',
                      email: member?.email || '',
                      avatar: {
                        fileUrl: member?.avatar?.fileUrl || '',
                        id: member?.avatar?.id || '',
                      },
                    },
                  }
                }) ?? [],
            }))
            .filter((question) => question.answers.length > 0) || []

        // Only include posts that have at least one question with answers
        if (questionsWithAnswers.length === 0) return
        const postId = post.id || post.slug
        if (!postId) {
          throw new Error(
            `Post is missing both id and slug. Data integrity issue detected. Post title: ${
              post.title ?? 'N/A'
            }.`
          )
        }
        allPosts.push({
          id: postId,
          slug: post.slug || '',
          title: post.title || '',
          heroImage: {
            resized: {
              medium: post.heroImage?.resized?.medium || '',
            },
          },
          subSubcategoriesOrdered:
            post.subSubcategoriesOrdered?.map((cat) => ({
              name: cat?.name || '',
            })) || [],
          postEssayQuestions: questionsWithAnswers,
        })
      })
    })

    return allPosts
  }, [data])

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
    if (hasShownToast || !titleRef.current) return

    const handleScroll = () => {
      if (hasShownToast || !titleRef.current) return

      const titleRect = titleRef.current.getBoundingClientRect()
      const threshold = 120
      if (titleRect.top < threshold) {
        toast.success('向左滑動可以看到更多文章喔！')
        setHasShownToast(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [hasShownToast])

  const showLoading = isLoading || isFetchingNextPage

  return (
    <div className="mt-10 mb-14 flex w-[calc(100%+48px)] flex-col gap-8 tablet:mb-16 tablet:w-[calc(100%+64px)] desktop:mt-18 desktop:mb-24 desktop:w-[calc(100%+96px)] hd:mt-24 hd:mb-30 hd:w-screen">
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
        className="flex scrollbar-thin snap-x snap-mandatory scroll-px-6 gap-6 overflow-x-auto px-6 tablet:scroll-px-8 tablet:px-8 desktop:scroll-px-12 desktop:px-12 hd:scroll-pr-14 hd:scroll-pl-[calc(50vw-600px+64px)] hd:pr-14 hd:pl-[calc(50vw-600px+64px)]"
      >
        {posts.map((post) => (
          <div key={post.id} className="flex-shrink-0 snap-start">
            <PostAnswerCard post={post} onOpenModal={onOpenModal} />
          </div>
        ))}
        {hasNextPage && (
          <div
            ref={loadMoreRef}
            className="h-1 w-1 flex-shrink-0"
            aria-hidden="true"
          />
        )}
        {!isLoading && posts.length === 0 && (
          <div className="flex w-full items-center justify-center py-12 text-center">
            <p className="prose-p1 text-neutral-500">尚無回答</p>
          </div>
        )}
        {showLoading && (
          <>
            {[1, 2, 3].map((index) => (
              <div
                key={`skeleton-${index}`}
                className="flex-shrink-0 snap-start"
              >
                <PostAnswerCardSkeleton />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default memo(AllAnswers)
