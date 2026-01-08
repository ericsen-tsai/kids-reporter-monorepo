import { useMutation } from '@tanstack/react-query'

import { deleteMemberAvatar, uploadMemberAvatar } from '@/api/member-avatar'
export const useUploadMemberAvatarMutation = ({
  accessToken,
}: {
  accessToken: string
}) => {
  return useMutation({
    mutationFn: ({ file, fileName }: { file: File; fileName?: string }) =>
      uploadMemberAvatar(file, accessToken, fileName),
  })
}

export const useDeleteMemberAvatarMutation = ({
  accessToken,
}: {
  accessToken: string
}) => {
  return useMutation({
    mutationFn: (avatarId: string) => deleteMemberAvatar(avatarId, accessToken),
  })
}
