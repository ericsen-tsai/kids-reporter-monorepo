import { UpdateMemberProfileMutationVariables } from '__generated__/operations/member.generated'
import { MemberUpdateInput } from '__generated__/types'
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
    MemberUpdateInput | undefined,
    Error,
    Pick<UpdateMemberProfileMutationVariables, 'data'>
  >
}) => {
  return useMutation({
    mutationFn: (
      variables: Pick<UpdateMemberProfileMutationVariables, 'data'>
    ) => updateMemberProfile({ memberId, accessToken, data: variables.data }),
    ...options,
  })
}
