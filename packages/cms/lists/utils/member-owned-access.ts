import type { Session } from '../../types/index'
import { allowRoles, RoleEnum } from './access-control-list'

// Common operation access for member-owned resources
export const memberOwnedOperationAccess = allowRoles([
  RoleEnum.Admin,
  RoleEnum.Member,
])

// Factory for member-owned filters
// relationKey === 'self' → filter by own id
// otherwise → filter by relationKey.id equals member id
export const makeMemberOwnedFilter =
  (relationKey: 'self' | string) =>
  ({ session }: { session?: Session }) => {
    const role = session?.data?.role
    if (role === RoleEnum.Admin) {
      return true
    }
    const memberID =
      session?.data && 'memberId' in session.data
        ? session.data.memberId
        : undefined
    if (!memberID) {
      return false
    }
    if (relationKey === 'self') {
      return { id: { equals: memberID } }
    }
    return { [relationKey]: { id: { equals: memberID } } }
  }

export const memberOwnedPrivateFieldQueryAccess = ({
  session,
  item,
}: {
  session?: Session
  item: Record<string, unknown>
}) => {
  const role = session?.data?.role
  if (role === RoleEnum.Admin) {
    return true
  }
  const memberId =
    session?.data && 'memberId' in session.data
      ? session.data.memberId
      : undefined

  if (memberId === item.id) {
    return true
  }

  return false
}
