'use client'

import { Author } from '@/components/author-card'

import CrossBorderCollaboration from './components/cross-border-collaboration'
import DiscoverNews from './components/discover-news'
import Intro from './components/intro'
import JoinUs from './components/join-us'
import ReaderRecommendations from './components/reader-recommendations'
import RelatedProducts from './components/related-products'
import TeamMemberAndConsultant from './components/team-member-and-consultant'

type AboutModuleProps = {
  teamMembers: Author[]
  consultants: Author[]
}

function AboutModule({ teamMembers, consultants }: AboutModuleProps) {
  return (
    <main className="flex w-full flex-col items-center justify-center overflow-x-hidden">
      <Intro />
      <DiscoverNews />
      <div className="w-screen bg-yellow-100">
        <RelatedProducts />
        <CrossBorderCollaboration />
      </div>
      <ReaderRecommendations />
      <JoinUs />
      <TeamMemberAndConsultant
        teamMembers={teamMembers}
        consultants={consultants}
      />
    </main>
  )
}

export default AboutModule
