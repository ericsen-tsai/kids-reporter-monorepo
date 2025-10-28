import { RoleEnum } from '../constants/index'

export type MemberSession = {
  listKey: 'Member'
  itemId: string
  data?: {
    role?: (typeof RoleEnum)[keyof typeof RoleEnum]
    memberId?: string
    twreporterUserId?: string
    twoFactorAuth?: {
      bypass: true
    }
  }
}

export type AdminSession = {
  listKey: 'User'
  itemId: string
  data?: {
    role?: (typeof RoleEnum)[keyof typeof RoleEnum]
    id?: string
    name?: string
    email?: string
    twoFactorAuth?: {
      set?: boolean
      bypass?: boolean
      id?: string
    }
  }
}

export type Session = AdminSession | MemberSession
