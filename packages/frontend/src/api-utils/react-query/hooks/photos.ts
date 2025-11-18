import { useMutation } from '@tanstack/react-query'

import { deletePhoto, uploadPhoto } from '@/api/photo'

export const useUploadPhotoMutation = ({
  accessToken,
}: {
  accessToken: string
}) => {
  return useMutation({
    mutationFn: ({ file, fileName }: { file: File; fileName?: string }) =>
      uploadPhoto(file, accessToken, fileName),
  })
}

export const useDeletePhotoMutation = ({
  accessToken,
}: {
  accessToken: string
}) => {
  return useMutation({
    mutationFn: (photoId: string) => deletePhoto(photoId, accessToken),
  })
}
