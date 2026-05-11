import {
  getMemberProfileMeContentApi,
  type MemberProfilePatchBody,
  updateMemberProfileMeContentApi,
} from '@/api/content-api/member-profile'

export const getMemberProfileByTwreporterUserId = async ({
  twreporterUserId,
  accessToken,
}: {
  twreporterUserId: string
  accessToken: string
}) => {
  const me = await getMemberProfileMeContentApi({ accessToken })
  return me.twreporter_user_id === twreporterUserId ? me : undefined
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
  const me = await getMemberProfileMeContentApi({
    accessToken,
    signal: abortSignal,
  })
  return me.id === memberId ? me : undefined
}

export const updateMemberProfile = async ({
  memberId,
  accessToken,
  data,
}: {
  memberId: string
  accessToken: string
  data: MemberProfilePatchBody
}) => {
  const updated = await updateMemberProfileMeContentApi({ accessToken, data })
  return updated.id === memberId ? updated : undefined
}
