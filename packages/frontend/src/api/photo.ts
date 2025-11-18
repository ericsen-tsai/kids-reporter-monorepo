import {
  CreatePhotoMutation,
  DeletePhotoMutation,
} from '__generated__/operations/photo.generated'
import axios, { AxiosResponse } from 'axios'
import { print } from 'graphql/language/printer'

import { API_URL, INTERNAL_API_URL } from '@/constants'
import envVars from '@/environment-variables'
import { sendGQLRequest } from '@/utils'

import { CREATE_PHOTO_MUTATION, DELETE_PHOTO_MUTATION } from './graphql/photo'

export const uploadPhoto = async (
  file: File,
  accessToken: string,
  fileName?: string
) => {
  const url =
    typeof window === 'undefined' && !envVars.isProduction
      ? INTERNAL_API_URL
      : API_URL

  // Create multipart form data for file upload
  const formData = new FormData()

  // Prepare operations with file set to null
  // Include name field (using filename without extension as default)
  const newFileName = fileName || file.name.replace(/\.[^/.]+$/, '') || 'photo'
  const operations = {
    query: print(CREATE_PHOTO_MUTATION),
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

  const response: AxiosResponse<{ data: CreatePhotoMutation }> =
    await axios.post(url, formData, {
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        'apollo-require-preflight': 'true',
      },
      withCredentials: true,
    })

  return response?.data?.data?.item
}

export const deletePhoto = async (photoId: string, accessToken: string) => {
  const response = await sendGQLRequest<DeletePhotoMutation>(
    {
      query: DELETE_PHOTO_MUTATION,
      variables: {
        where: { id: photoId },
      },
    },
    {
      authToken: accessToken,
    }
  )

  return response?.data?.data?.deletePhoto
}
