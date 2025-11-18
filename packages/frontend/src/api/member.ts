import {
  GetMemberProfileQuery,
  GetMemberProfileQueryVariables,
} from '__generated__/operations/member.generated'
import { MemberUpdateInput } from '__generated__/types'

import { sendGQLRequest } from '@/utils'

import {
  GET_MEMBER_PROFILE_GQL,
  UPDATE_MEMBER_PROFILE_GQL,
} from './graphql/member'

export const getMemberProfileByTwreporterUserId = async ({
  twreporterUserId,
  accessToken,
}: {
  twreporterUserId: string
  accessToken: string
}) => {
  const variables: GetMemberProfileQueryVariables = {
    where: {
      twreporter_user_id: twreporterUserId,
    },
  }

  const response = await sendGQLRequest<GetMemberProfileQuery>(
    {
      query: GET_MEMBER_PROFILE_GQL,
      variables,
    },
    {
      authToken: accessToken,
    }
  )

  return response?.data?.data?.member
}

export const getMemberProfileByMemberId = async ({
  memberId,
  accessToken,
}: {
  memberId: string
  accessToken: string
}) => {
  const variables: GetMemberProfileQueryVariables = {
    where: {
      id: memberId,
    },
  }

  const response = await sendGQLRequest<GetMemberProfileQuery>(
    {
      query: GET_MEMBER_PROFILE_GQL,
      variables,
    },
    {
      authToken: accessToken,
    }
  )

  return response?.data?.data?.member
}

export const updateMemberProfile = async ({
  memberId,
  accessToken,
  data,
}: {
  memberId: string
  accessToken: string
  data: MemberUpdateInput
}) => {
  const response = await sendGQLRequest<MemberUpdateInput>(
    {
      query: UPDATE_MEMBER_PROFILE_GQL,
      variables: {
        where: { id: memberId },
        data,
      },
    },
    {
      authToken: accessToken,
    }
  )

  return response?.data?.data
}
