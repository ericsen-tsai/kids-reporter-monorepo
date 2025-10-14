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
  ({ session }: { session?: any }) => {
    const role = session?.data?.role
    if (role === RoleEnum.Admin) {
      return true
    }
    const memberID = session?.data?.member?.id
    if (!memberID) {
      return false
    }
    if (relationKey === 'self') {
      return { id: { equals: memberID } }
    }
    return { [relationKey]: { id: { equals: memberID } } }
  }
