'use client'

import Image from 'next/image'

import { DEFAULT_AVATAR } from '@/constants'
import { StarIcon } from '@/icons/miscellaneous'

import { getDisplayLikesCount } from '../utils'

type AnswerCardProps = {
  content: string
  memberName: string
  memberAvatar?: string
  likesCount: number
  onClick?: () => void
}

function AnswerCard({
  content,
  memberName,
  memberAvatar,
  likesCount,
  onClick,
}: AnswerCardProps) {
  return (
    <div
      className="flex min-h-[182px] w-75 cursor-pointer flex-col justify-between rounded-2xl border-2 border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 tablet:w-full"
      onClick={onClick}
    >
      <p className="line-clamp-3 prose-p1-bold text-neutral-900">{content}</p>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 items-center gap-2 truncate">
          <div className="relative size-10 flex-shrink-0 overflow-hidden rounded-full">
            <Image
              src={memberAvatar || DEFAULT_AVATAR}
              alt={memberName}
              className="size-full bg-white object-cover"
              fill
              sizes="40px"
            />
          </div>
          <span className="truncate prose-p2-bold text-neutral-900">
            {memberName}
          </span>
        </div>
        <div className="flex w-14 items-center gap-1">
          <StarIcon />
          <span className="prose-p2-medium text-neutral-600">
            {getDisplayLikesCount(likesCount)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default AnswerCard
