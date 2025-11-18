import { UpdateMemberProfileMutationVariables } from '__generated__/operations/member.generated'
import { useMutation } from '@tanstack/react-query'

import { updateMemberProfile } from '@/api/member'
import { useHydratedAuthStore } from '@/services/auth/use-hydrated-auth-store'

export const useUpdateMemberProfileMutation = ({
  accessToken,
  memberId,
}: {
  accessToken: string
  memberId: string
}) => {
  const { exchangeTokenAndPopulateMember } = useHydratedAuthStore()
  return useMutation({
    mutationFn: (variables: UpdateMemberProfileMutationVariables) =>
      updateMemberProfile({ memberId, accessToken, data: variables.data }),
    onSuccess: () => {
      exchangeTokenAndPopulateMember()
    },
  })
}
