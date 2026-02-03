import type { GetAuthorAvatarQuery } from '__generated__/operations/content.generated'
import { Metadata } from 'next'

import { DEFAULT_AVATAR, GENERAL_DESCRIPTION } from '@/constants'
import envVars from '@/environment-variables'
import AboutModule from '@/modules/about'
import { consultants, teamMembers } from '@/modules/about/constants'
import { sendRestGqlRequest } from '@/utils/send-rest-gql'

export const metadata: Metadata = {
  title: '關於少年報導者 - 少年報導者 The Reporter for Kids',
  description: GENERAL_DESCRIPTION,
}

export const revalidate = envVars.isProduction ? 86400 : 0 // 1 day

export default async function About() {
  for (const member of teamMembers) {
    const res = await sendRestGqlRequest<GetAuthorAvatarQuery>({
      operation: 'author-avatar',
      method: 'GET',
      variables: {
        where: {
          slug: member.slug,
        },
      },
    })
    const avatar = res?.data?.data?.author?.avatar?.resized?.tiny
    member.avatar = avatar ?? DEFAULT_AVATAR
  }

  return <AboutModule teamMembers={teamMembers} consultants={consultants} />
}
