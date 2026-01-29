'use client'

import Image from 'next/image'

import { Author } from '@/components/author-card'

import MemberCard from './team-member-card'

type TeamMemberAndConsultantProps = {
  teamMembers: Author[]
  consultants: Author[]
}

function TeamMemberAndConsultant({
  teamMembers,
  consultants,
}: TeamMemberAndConsultantProps) {
  return (
    <section className="mx-auto w-full max-w-300 px-6 pb-14 tablet:px-8 tablet:pb-16 desktop:pb-24 hd:pb-30">
      <div className="mx-auto flex w-max flex-col gap-10">
        <div
          id="team"
          style={{ scrollMarginTop: '62px' }}
          className="my-10 flex flex-col gap-6 tablet:my-24 desktop:my-32 desktop:gap-8 hd:my-36 hd:gap-10"
        >
          <div className="flex items-center gap-3 tablet:mx-auto">
            <Image
              src="/assets/images/about/team-member-and-consultant/team_icon.svg"
              alt="Team icon"
              className="size-11"
              width={44}
              height={44}
            />
            <h2 className="prose-h2-small !font-swei text-neutral-900 desktop:prose-h2-large">
              我們的團隊
            </h2>
          </div>

          <div className="flex scrollbar-thin snap-x snap-mandatory gap-6 overflow-x-auto pb-2 tablet:grid tablet:snap-none tablet:grid-cols-2 tablet:overflow-x-hidden desktop:grid-cols-3 desktop:gap-8 hd:grid-cols-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="w-[248px] snap-start">
                <MemberCard member={member} isTeamMember />
              </div>
            ))}
          </div>
        </div>

        <div
          id="consultants"
          style={{ scrollMarginTop: '62px' }}
          className="flex flex-col gap-6 desktop:gap-8 hd:gap-10"
        >
          <div className="flex items-center gap-3 tablet:mx-auto">
            <Image
              src="/assets/images/about/team-member-and-consultant/consultant_icon.svg"
              alt="Consultant icon"
              className="h-11 w-11"
              width={44}
              height={44}
            />
            <h2 className="prose-h2-small !font-swei text-neutral-900 desktop:prose-h2-large">
              我們的顧問
            </h2>
          </div>

          <div className="flex scrollbar-thin snap-x snap-mandatory gap-6 overflow-x-auto pb-2 tablet:grid tablet:snap-none tablet:grid-cols-2 tablet:overflow-x-hidden desktop:grid-cols-3 desktop:gap-8 hd:grid-cols-4">
            {consultants.map((consultant) => (
              <div key={consultant.id} className="w-[248px] snap-start">
                <MemberCard member={consultant} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TeamMemberAndConsultant
