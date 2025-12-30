'use client'

import { cn } from '@kids-reporter/routing-ui'
import { memo } from 'react'

import { useAllPostEssayAnswersQuery } from '@/api-utils/react-query/hooks/post-essay-answer'

import { getMemberDisplayName } from '../utils'
import AnswerCard from './answer-card'
import AnswerCardSkeleton from './answer-card-skeleton'

type LatestAnswersProps = {
  onOpenModal: (postSlug: string) => void
}

function LatestAnswers({ onOpenModal }: LatestAnswersProps) {
  const { data: latestEssayAnswers = [], isPending: isLoading } =
    useAllPostEssayAnswersQuery({
      orderBy: [{ createdAt: 'desc' }],
      take: 3,
    })

  const answers = latestEssayAnswers.map((answer) => {
    const question = answer.question
    return {
      id: answer.id,
      content: answer.content ?? '',
      memberName: getMemberDisplayName(answer.member),
      memberAvatar: answer.member?.avatar?.fileUrl ?? '',
      likesCount: answer.likesCount ?? 0,
      postSlug: question?.post?.slug ?? '',
    }
  })

  const handleAnswerCardClick = (postSlug: string) => {
    onOpenModal(postSlug)
  }

  return (
    <div className="mt-6 mb-14 flex w-[calc(100%+48px)] flex-col gap-6 tablet:mt-8 tablet:mb-16 tablet:w-full tablet:gap-8 desktop:mt-14 desktop:mb-24 desktop:gap-10 hd:mt-20 hd:mb-30">
      <div className="flex items-center gap-3 pl-6 tablet:pl-0">
        <div className="h-8 w-1.5 rounded-md bg-yellow-400" />
        <h3 className="prose-h3-small font-swei text-neutral-900 desktop:prose-h3-large">
          最新回答
        </h3>
      </div>
      <div
        className={cn(
          'flex scrollbar-thin snap-x snap-mandatory scroll-px-6 gap-6 overflow-x-auto px-6 tablet:grid tablet:snap-none tablet:grid-cols-3 tablet:overflow-x-hidden tablet:px-0 desktop:gap-8',
          !isLoading && answers.length === 0 && 'tablet:grid-cols-1'
        )}
      >
        {isLoading && (
          <>
            {[1, 2, 3].map((index) => (
              <div key={index} className="flex-1 snap-start">
                <AnswerCardSkeleton />
              </div>
            ))}
          </>
        )}
        {!isLoading &&
          answers.length > 0 &&
          answers.map((answer) => (
            <div key={answer.id} className="flex-1 snap-start">
              <AnswerCard
                {...answer}
                onClick={() => handleAnswerCardClick(answer.postSlug)}
              />
            </div>
          ))}
        {!isLoading && answers.length === 0 && (
          <div className="flex w-full items-center justify-center py-12 text-center">
            <p className="prose-p1 text-neutral-500">尚無回答</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(LatestAnswers)
