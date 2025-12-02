import { Member } from '__generated__/types'

import { DEFAULT_TEXT_HOLDER } from '@/constants/input-field'

export const getMemberDisplayName = (member: Member | undefined) => {
  if (!member) return DEFAULT_TEXT_HOLDER
  return member.nickname || member.name || member.email || DEFAULT_TEXT_HOLDER
}
