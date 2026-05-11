import { useMutation, UseMutationOptions } from '@tanstack/react-query'

import { updateMemberProfile } from '@/api/member'

export const useUpdateMemberProfileMutation = ({
  accessToken,
  memberId,
  options,
}: {
  accessToken: string
  memberId: string
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof updateMemberProfile>>,
    Error,
    { data: Parameters<typeof updateMemberProfile>[0]['data'] }
  >
}) => {
  return useMutation({
    mutationFn: (variables: {
      data: Parameters<typeof updateMemberProfile>[0]['data']
    }) => updateMemberProfile({ memberId, accessToken, data: variables.data }),
    ...options,
  })
}
