import { RoleEnum } from '../constants/index'

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

export type Session = AdminSession
