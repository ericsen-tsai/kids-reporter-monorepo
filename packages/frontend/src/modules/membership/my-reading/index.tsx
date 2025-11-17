'use client'
import {
  Button,
  HeaderMobileBackButtonHrefSetter,
} from '@kids-reporter/routing-ui'
import { useEffect, useMemo, useState } from 'react'

import { useGetMemberPostsWithAnswersInfinityQuery } from '@/api-utils/react-query/hooks/extended'
import { ArrowLeft, ArrowRight } from '@/icons'
import { useHydratedAuthStore } from '@/services/auth/use-hydrated-auth-store'

import MembershipSideMenu from '../components/side-menu'
import PostQuestionAnswersList from './post-question-answers-list'
import { parseMemberPostsWithAnswersToPostQuestionAnswers } from './utils'

const PAGE_ITEM_COUNT = 5

function MyReading() {
  const [currentPage, setCurrentPage] = useState(1)
  const { member, tokens } = useHydratedAuthStore()
  const {
    data: memberPostsWithAnswersPageData,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useGetMemberPostsWithAnswersInfinityQuery({
    memberId: member?.id ?? '',
    take: PAGE_ITEM_COUNT,
    accessToken: tokens?.accessToken ?? '',
  })

  const memberPostsWithAnswers = useMemo(() => {
    return memberPostsWithAnswersPageData?.pages[currentPage - 1]?.posts ?? []
  }, [memberPostsWithAnswersPageData, currentPage])

  const currentPostQuestionAnswers = memberPostsWithAnswers
    ? parseMemberPostsWithAnswersToPostQuestionAnswers(memberPostsWithAnswers)
    : []

  const isFirstPage = currentPage === 1
  const isLastPage =
    currentPage === (memberPostsWithAnswersPageData?.pages.length ?? 0)

  useEffect(() => {
    if (hasNextPage) {
      fetchNextPage()
    }
  }, [currentPage, fetchNextPage, hasNextPage])

  const isGetMemberPostsWithAnswersLoading = isLoading || !member?.id

  return (
    <div className="mx-auto w-full bg-neutral-100 pt-6 pb-40 tablet:pt-8 desktop:px-12 desktop:pt-16 desktop:pb-50">
      <div className="mx-auto w-full max-w-300 tablet:grid tablet:grid-cols-12 tablet:gap-6 desktop:gap-8">
        <HeaderMobileBackButtonHrefSetter href="/member" />
        <div className="hidden tablet:col-span-2 tablet:block tablet:min-w-[150px]">
          <MembershipSideMenu />
        </div>
        <div className="flex flex-1 flex-col px-6 tablet:col-span-10 tablet:px-8 desktop:col-span-8 desktop:px-0">
          <h1 className="mb-6 prose-h4-large font-swei text-neutral-900">
            我的回答
          </h1>
          <PostQuestionAnswersList
            postQuestionAnswers={currentPostQuestionAnswers}
            isLoading={isGetMemberPostsWithAnswersLoading}
            key={currentPage}
          />
          {!isGetMemberPostsWithAnswersLoading &&
            currentPostQuestionAnswers.length > 0 && (
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
