import {
  CreateMemberAvatarMutation,
  DeleteMemberAvatarMutation,
} from '__generated__/operations/members.generated'
import axios, { AxiosResponse } from 'axios'
import { print } from 'graphql/language/printer'

import { REST_GQL_ENDPOINT } from '@/constants'
import { sendRestGqlRequest } from '@/utils/send-rest-gql'

import { CREATE_MEMBER_AVATAR_MUTATION } from './graphql/member-avatar'

export const uploadMemberAvatar = async (
  file: File,
  accessToken: string,
  fileName?: string
) => {
  // Use REST GQL upload endpoint; payload mirrors GraphQL multipart spec.
  const formData = new FormData()

  // Route uses the REST endpoint; payload still follows GraphQL multipart spec.
  const newFileName =
    fileName || file.name.replace(/\.[^/.]+$/, '') || 'memberAvatar'
  const operations = {
    query: print(CREATE_MEMBER_AVATAR_MUTATION),
    operationName: 'CreateMemberAvatar',
    variables: {
      data: {
        name: newFileName,
        imageFile: {
          upload: null,
        },
      },
    },
  }

  // Map file index to variable path
  const map = {
    '1': ['variables.data.imageFile.upload'],
  }

  formData.append('operations', JSON.stringify(operations))
  formData.append('map', JSON.stringify(map))
  formData.append('1', file)

  // Route to the REST handler that proxies multipart uploads to GraphQL.
  const response: AxiosResponse<{
    status: string
    data: CreateMemberAvatarMutation
  }> = await axios.post(`${REST_GQL_ENDPOINT}/create-member-avatar`, formData, {
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      'apollo-require-preflight': 'true',
    },
    withCredentials: true,
  })

  return response?.data?.data?.item
}

export const deleteMemberAvatar = async (
  avatarId: string,
  accessToken: string
) => {
  const response = await sendRestGqlRequest<DeleteMemberAvatarMutation>({
    operation: 'delete-member-avatar',
    method: 'POST',
    variables: {
      where: { id: avatarId },
    },
    authToken: accessToken,
  })

  return response?.data?.data?.deleteMemberAvatar
}
