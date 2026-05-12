import {
  getMemberProfileMeContentApi,
  type MemberProfilePatchBody,
  updateMemberProfileMeContentApi,
} from '@/api/content-api/member-profile'

export const getMemberProfileByTwreporterUserId = async ({
  twreporterUserId,
  accessToken,
  traceHeaders,
}: {
  twreporterUserId: string
  accessToken: string
  traceHeaders?: Record<string, string>
}) => {
  const me = await getMemberProfileMeContentApi({ accessToken, traceHeaders })
  return me.twreporter_user_id === twreporterUserId ? me : undefined
}

export const getMemberProfileByMemberId = async ({
  memberId,
  accessToken,
  abortSignal,
  traceHeaders,
}: {
  memberId: string
  accessToken: string
  abortSignal?: AbortSignal
  traceHeaders?: Record<string, string>
}) => {
  const me = await getMemberProfileMeContentApi({
    accessToken,
    signal: abortSignal,
    traceHeaders,
  })
  return me.id === memberId ? me : undefined
}

export const updateMemberProfile = async ({
  memberId,
  accessToken,
  data,
  traceHeaders,
}: {
  memberId: string
  accessToken: string
  data: MemberProfilePatchBody
  traceHeaders?: Record<string, string>
}) => {
  const updated = await updateMemberProfileMeContentApi({
    accessToken,
    data,
    traceHeaders,
  })
  return updated.id === memberId ? updated : undefined
}
