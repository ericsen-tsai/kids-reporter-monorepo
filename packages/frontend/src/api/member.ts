import {
  GetMemberProfileQuery,
  GetMemberProfileQueryVariables,
  UpdateMemberProfileMutation,
  UpdateMemberProfileMutationVariables,
} from '__generated__/operations/member.generated'

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
  abortSignal,
}: {
  memberId: string
  accessToken: string
  abortSignal?: AbortSignal
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
      signal: abortSignal,
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
  data: UpdateMemberProfileMutationVariables['data']
}) => {
  const response = await sendGQLRequest<UpdateMemberProfileMutation>(
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
