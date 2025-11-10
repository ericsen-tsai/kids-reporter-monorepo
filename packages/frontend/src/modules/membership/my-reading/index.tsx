'use client'
import {
  Button,
  HeaderMobileBackButtonHrefSetter,
} from '@kids-reporter/routing-ui'
import { useState } from 'react'

import { ArrowLeft, ArrowRight } from '@/icons'

import MembershipSideMenu from '../components/side-menu'
import { PostQuestionAnswers } from '../types'
import { MOCK_POST_QUESTION_ANSWERS } from './mock-data'
import PostQuestionAnswersList from './post-question-answers-list'

type MyReadingProps = {
  postQuestionAnswers?: PostQuestionAnswers
}

const PAGE_ITEM_COUNT = 5

function MyReading({
  postQuestionAnswers = MOCK_POST_QUESTION_ANSWERS,
}: MyReadingProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(postQuestionAnswers.length / PAGE_ITEM_COUNT)
  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  const currentPostQuestionAnswers = postQuestionAnswers.slice(
    (currentPage - 1) * PAGE_ITEM_COUNT,
    currentPage * PAGE_ITEM_COUNT
  )

  return (
    <div className="mx-auto w-full bg-neutral-100 pt-6 pb-40 tablet:pt-8 desktop:px-12 desktop:pt-16">
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
            key={currentPage}
          />
          {postQuestionAnswers.length > PAGE_ITEM_COUNT && (
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
