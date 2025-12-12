'use client'

import { Member, PostEssayAnswerOrderByInput } from '__generated__/types'
import Image from 'next/image'
import { useCallback } from 'react'

import { usePostEssayQuestionEssayAnswersInfinityQuery } from '@/api-utils/react-query/hooks/post-essay-question'
import Divider from '@/components/divider'
import { DEFAULT_AVATAR } from '@/constants'
import { DEFAULT_TEXT_HOLDER } from '@/constants/input-field'
import { StarIcon, StarIconUnfilled } from '@/icons/miscellaneous'

import { getDisplayLikesCount, getMemberDisplayName } from '../utils'
import useOptimisticLikeAnswer from './hooks/use-optimistic-like-answer'

export const QUESTION_ANSWER_ITEM_TAKE = 5

type ModalAnswerItemProps = {
  answer: NonNullable<
    ReturnType<typeof usePostEssayQuestionEssayAnswersInfinityQuery>['data']
  >['pages'][number][number]
  hasLiked: boolean
  memberId: string
  accessToken: string
  questionId: string
  answerOrderBy: PostEssayAnswerOrderByInput[]
  answerIds: string[]
  isLast: boolean
}

function ModalAnswerItem({
  answer,
  hasLiked,
  memberId,
  accessToken,
  questionId,
  answerOrderBy,
  answerIds,
  isLast,
}: ModalAnswerItemProps) {
  const { toggleLike, isPending } = useOptimisticLikeAnswer({
    answerId: answer.id.toString(),
    memberId,
    accessToken,
    questionId,
    answerOrderBy,
    answerTake: QUESTION_ANSWER_ITEM_TAKE,
    answerIds,
  })

  const isLoggedIn = !!memberId && !!accessToken

  const handleLikeClick = useCallback(async () => {
    if (!memberId || !accessToken || isPending) return
    try {
      await toggleLike(hasLiked)
    } catch (error) {
      console.error('Failed to toggle like:', error)
    }
  }, [memberId, accessToken, isPending, toggleLike, hasLiked])

  return (
    <>
      <div className="min-w-0">
        <div className="flex min-w-0 flex-col gap-2 rounded-[12px]">
          <div className="flex min-w-0 items-center justify-between gap-2">
            <div className="flex max-w-full min-w-0 flex-1 items-center gap-2 overflow-hidden">
              <div className="relative size-10 flex-shrink-0 overflow-hidden rounded-full">
                <Image
                  src={answer.member?.avatar?.fileUrl || DEFAULT_AVATAR}
                  alt={
                    answer.member
                      ? getMemberDisplayName(answer.member as Member)
                      : 'User'
                  }
                  className="size-full bg-white object-cover"
                  fill
                  sizes="40px"
                />
              </div>
              <span className="w-0 min-w-0 flex-1 overflow-hidden prose-p2-bold text-ellipsis whitespace-nowrap text-neutral-900">
                {answer.member
                  ? getMemberDisplayName(answer.member as Member)
                  : DEFAULT_TEXT_HOLDER}
              </span>
            </div>
            <button
              onClick={handleLikeClick}
              disabled={!memberId || !accessToken || isPending}
              className="flex w-14 cursor-pointer items-center gap-1 disabled:cursor-not-allowed"
            >
              {isLoggedIn && hasLiked && (
                <StarIcon className="text-yellow-400" />
              )}
              {isLoggedIn && !hasLiked && <StarIconUnfilled />}
              {!isLoggedIn && <StarIcon />}
              <span className="prose-p2-medium text-neutral-600">
                {getDisplayLikesCount(answer.likesCount)}
              </span>
            </button>
          </div>
          <p className="prose-p1-bold text-neutral-900">
            {answer.content ?? ''}
          </p>
        </div>
      </div>
      {!isLast && <Divider className="my-4" />}
    </>
  )
}

export default ModalAnswerItem
