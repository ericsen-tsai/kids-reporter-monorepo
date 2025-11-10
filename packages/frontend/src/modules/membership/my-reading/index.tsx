'use client'
import {
  Button,
  HeaderMobileBackButtonHrefSetter,
} from '@kids-reporter/routing-ui'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'

import { getMemberPostsWithAnswers } from '@/api/extended'
import {
  MEMBER_POSTS_WITH_ANSWERS_QUERY_KEY,
  useGetMemberPostsWithAnswersQuery,
} from '@/api-utils/react-query/hooks/extended'
import { ArrowLeft, ArrowRight } from '@/icons'
import { useHydratedAuthStore } from '@/services/auth/use-hydrated-auth-store'

import MembershipSideMenu from '../components/side-menu'
import PostQuestionAnswersList from './post-question-answers-list'
import { parseMemberPostsWithAnswersToPostQuestionAnswers } from './utils'

const PAGE_ITEM_COUNT = 5

function MyReading() {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState<number | undefined>()
  const { member, tokens } = useHydratedAuthStore()
  const { data: memberPostsWithAnswersData, isLoading } =
    useGetMemberPostsWithAnswersQuery({
      memberId: member?.id ?? '',
      take: PAGE_ITEM_COUNT,
      skip: (currentPage - 1) * PAGE_ITEM_COUNT,
      accessToken: tokens?.accessToken ?? '',
    })

  useEffect(() => {
    if (typeof totalCount === 'number' && memberPostsWithAnswersData) return
    setTotalCount(memberPostsWithAnswersData?.totalCount)
  }, [memberPostsWithAnswersData, totalCount])

  const totalPages = totalCount ? Math.ceil(totalCount / PAGE_ITEM_COUNT) : 0

  const currentPostQuestionAnswers = memberPostsWithAnswersData
    ? parseMemberPostsWithAnswersToPostQuestionAnswers(
        memberPostsWithAnswersData
      )
    : []

  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  const queryClient = useQueryClient()
  const handlePrefetchNextPage = useCallback(() => {
    if (isLastPage || !member?.id) return
    queryClient.prefetchQuery({
      queryKey: [
        MEMBER_POSTS_WITH_ANSWERS_QUERY_KEY,
        member?.id ?? '',
        PAGE_ITEM_COUNT,
        currentPage + 1,
      ],
      queryFn: () =>
        getMemberPostsWithAnswers({
          memberId: member?.id ?? '',
          take: PAGE_ITEM_COUNT,
          skip: currentPage * PAGE_ITEM_COUNT,
          accessToken: tokens?.accessToken ?? '',
        }),
    })
  }, [currentPage, isLastPage, member?.id, queryClient, tokens?.accessToken])

  useEffect(() => {
    handlePrefetchNextPage()
  }, [currentPage, handlePrefetchNextPage])

  const isGetMemberPostsWithAnswersLoading = isLoading || !member?.id

  return (
    <div className="mx-auto w-full bg-neutral-100 pt-6 pb-40 tablet:pt-8 desktop:px-12 desktop:pt-16 desktop:pb-50">
      <div className="mx-auto flex w-full max-w-300 gap-8">
        <HeaderMobileBackButtonHrefSetter href="/member" />
        <div className="hidden tablet:block">
          <MembershipSideMenu />
        </div>
        <div className="flex flex-1 flex-col px-6 tablet:px-8 desktop:px-0">
          <h1 className="mb-6 prose-h4-large font-family-swei text-neutral-900">
            我的回答
          </h1>
          <PostQuestionAnswersList
            postQuestionAnswers={currentPostQuestionAnswers}
            isLoading={isGetMemberPostsWithAnswersLoading}
            key={currentPage}
          />
          {!isLoading && totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-4">
              <Button
                variant="secondary"
                className="size-11 p-0"
                disabled={isFirstPage}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ArrowLeft />
              </Button>
              <Button
                variant="secondary"
                className="size-11 p-0"
                disabled={isLastPage}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ArrowRight />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyReading
