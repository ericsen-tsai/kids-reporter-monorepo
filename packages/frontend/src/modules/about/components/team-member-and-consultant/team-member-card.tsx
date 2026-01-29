'use client'

import { cn } from '@kids-reporter/routing-ui'
import Image from 'next/image'
import Link from 'next/link'

import { useAuthorAvatarQuery } from '@/api-utils/react-query/hooks/author-avatar'
import type { Author } from '@/components/author-card'
import { DEFAULT_AVATAR } from '@/constants'
import { ArrowRight } from '@/icons/arrow'

type MemberCardProps = {
  member: Author
  isTeamMember?: boolean
}

function MemberCard({ member, isTeamMember = false }: MemberCardProps) {
  const { data: fetchedAvatar } = useAuthorAvatarQuery({
    slug: member.slug,
    avatar: member.avatar,
  })

  const avatarURL = member.avatar || fetchedAvatar || DEFAULT_AVATAR
  const roleText = member.roleName ?? member.role
  const href = member.slug ? `/author/${member.slug}` : '#'

  const cardContent = (
    <>
      <div
        className={cn(
          'flex h-full flex-col items-center justify-center gap-5 transition-opacity',
          isTeamMember ? 'group-hover:opacity-0' : ''
        )}
      >
        <div className="h-30 w-30 overflow-hidden rounded-full">
          <Image
            className="h-full w-full object-cover"
            src={avatarURL}
            alt={member.name}
            width={120}
            height={120}
            loading="lazy"
          />
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-center prose-h6-large font-bold text-neutral-900">
            {member.name}
          </span>
          <span className="text-center prose-p2-bold text-neutral-700">
            {roleText}
          </span>
        </div>
      </div>

      <div className="absolute inset-0 z-10 flex h-full flex-col gap-4 bg-neutral-300 p-6 opacity-0 transition-opacity group-hover:opacity-100 group-active:opacity-100">
        <div className="flex flex-1 flex-col gap-1">
          <span className="prose-p1-bold text-neutral-900">
            {member.name}｜{roleText}
          </span>
          <p className="line-clamp-6 text-justify prose-p2 text-neutral-900">
            {member.bio}
          </p>
        </div>

        {isTeamMember && (
          <div className="flex justify-end">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-white">
              <ArrowRight />
            </div>
          </div>
        )}
      </div>
    </>
  )

  if (isTeamMember) {
    return (
      <Link
        href={href}
        aria-disabled={!isTeamMember}
        tabIndex={isTeamMember ? 0 : -1}
        className={cn(
          'group relative block h-[270px] w-[248px] overflow-hidden rounded-[20px] border-2 border-neutral-200 bg-neutral-white p-6',
          !isTeamMember ? 'pointer-events-none' : ''
        )}
      >
        {cardContent}
      </Link>
    )
  }

  return (
    <div className="group relative flex h-[270px] w-[248px] flex-col items-center justify-center gap-5 overflow-hidden rounded-[20px] border-2 border-neutral-200 bg-neutral-white p-6">
      {cardContent}
    </div>
  )
}

export default MemberCard
