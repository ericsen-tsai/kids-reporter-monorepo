import {
  V1MemberAvatarDeleteResponseSchema,
  V1MemberAvatarUploadResponseSchema,
} from '@kids-reporter/api-types'
import axios from 'axios'

import { CONTENT_API_ORIGIN, INTERNAL_CONTENT_API_ORIGIN } from '@/constants'
import { sendContentApiRequest } from '@/utils/send-content-api'
import { buildTraceHeaders } from '@/utils/trace-context'

const memberAvatarUploadUrl = () => {
  const base =
    typeof window === 'undefined'
      ? INTERNAL_CONTENT_API_ORIGIN
      : CONTENT_API_ORIGIN
  return `${base}/v1/members/me/avatar`
}

export const uploadMemberAvatar = async (
  file: File,
  accessToken: string,
  fileName?: string
) => {
  const formData = new FormData()
  const uploadFileName = fileName || file.name || 'memberAvatar'
  formData.append('file', file, uploadFileName)

  const response = await axios.post(memberAvatarUploadUrl(), formData, {
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...buildTraceHeaders(),
    },
    // content-api /v1/* routes are bearer-token auth, not cookie auth
    withCredentials: false,
  })
  const parsed = V1MemberAvatarUploadResponseSchema.safeParse(response.data)
  if (!parsed.success) {
    throw new Error('content-api invalid member avatar upload response')
  }
  return parsed.data
}

export const deleteMemberAvatar = async (
  _avatarId: string,
  accessToken: string
) => {
  void _avatarId
  const body = await sendContentApiRequest({
    path: '/v1/members/me/avatar',
    method: 'DELETE',
    authToken: accessToken,
  })
  const parsed = V1MemberAvatarDeleteResponseSchema.safeParse(body)
  if (!parsed.success) {
    throw new Error('content-api invalid member avatar delete response')
  }
  return parsed.data
}
