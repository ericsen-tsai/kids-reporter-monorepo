import { UpdateMemberProfileMutationVariables } from '__generated__/operations/member.generated'
import { useMutation } from '@tanstack/react-query'

import { updateMemberProfile } from '@/api/member'

export const useUpdateMemberProfileMutation = ({
  accessToken,
  memberId,
}: {
  accessToken: string
  memberId: string
}) => {
  return useMutation({
    mutationFn: (variables: UpdateMemberProfileMutationVariables) =>
      updateMemberProfile({ memberId, accessToken, data: variables.data }),
  })
}
