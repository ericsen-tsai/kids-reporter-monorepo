'use client'

import { cn } from '@kids-reporter/routing-ui'
import { useMemo } from 'react'

import { useAllPostEssayAnswersQuery } from '@/api-utils/react-query/hooks/post-essay-answer'
import { DEFAULT_TEXT_HOLDER } from '@/constants/input-field'

import AnswerCard from './answer-card'
import AnswerCardSkeleton from './answer-card-skeleton'

function LatestAnswers() {
  const { data: latestEssayAnswers = [], isPending: isLoading } =
    useAllPostEssayAnswersQuery({
      orderBy: [{ createdAt: 'desc' }],
      take: 3,
    })

  const answers = useMemo(() => {
    return latestEssayAnswers.map((answer) => ({
      id: answer.id,
      content: answer.content ?? '',
      memberName:
        answer.member?.nickname || answer.member?.name || DEFAULT_TEXT_HOLDER,
      memberAvatar: answer.member?.avatar?.fileUrl ?? '',
      likesCount: answer.likesCount ?? 0,
    }))
  }, [latestEssayAnswers])

  return (
    <div className="mt-10 mb-14 flex w-[calc(100%+48px)] flex-col gap-8 tablet:mb-16 tablet:w-full desktop:mt-18 desktop:mb-24 hd:mt-24 hd:mb-30">
      <div className="flex items-center gap-3 pl-6 tablet:pl-0">
        <div className="h-8 w-1.5 rounded-md bg-yellow-400" />
        <h3 className="prose-h3-small font-swei text-neutral-900 desktop:prose-h3-large">
          最新回答
        </h3>
      </div>
      <div
        className={cn(
          'flex snap-x snap-mandatory scroll-pr-6 scroll-pl-6 gap-6 overflow-x-auto px-6 tablet:grid tablet:snap-none tablet:grid-cols-3 tablet:overflow-x-hidden tablet:px-0',
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
              <AnswerCard {...answer} />
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

export default LatestAnswers
