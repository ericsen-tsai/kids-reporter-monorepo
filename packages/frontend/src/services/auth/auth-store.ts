'use client'

import errors from '@twreporter/errors'
import axios from 'axios'
import { create } from 'zustand'
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from 'zustand/middleware'

import {
  getMemberProfileByMemberId,
  getMemberProfileByTwreporterUserId,
} from '@/api/member'
import {
  ACCESS_TOKEN_ENDPOINT,
  LOGOUT_ENDPOINT,
  STATUS_CODES,
} from '@/constants'
import { AXIOS_TIMEOUT, log, LogLevel } from '@/utils'

export type MemberProfile = {
  id: string
  name?: string
  email?: string
  twreporter_user_id?: string
  showBaodaozai?: boolean
  essayQuestionCount?: number
  nickname?: string
  contactEmail?: string
  avatar?: {
    id: string
    url: string
  }
  joinedAt?: string
}

type AuthTokens = {
  accessToken: string
  expiresAt?: number
}

type AuthStatus =
  | 'idle'
  | 'loading'
  | 'unauthenticated'
  | 'authenticated'
  | 'error'

type AuthState = {
  member?: MemberProfile
  tokens?: AuthTokens
  status: AuthStatus
  error?: string
  exchangeTokenAndPopulateMember: () => Promise<void>
  fetchMember: () => Promise<void>
  setAuth: (
    payload: Partial<{
      member: MemberProfile
      tokens: AuthTokens
    }>
  ) => void
  clearAuth: () => void
  logout: () => Promise<void>
}

type AccessTokenResponse = {
  status: 'success' | 'fail' | 'error'
  data: {
    accessToken: string
    expiresAt?: number
    twreporterUserId: string
  }
}

type PersistedAuthState = Partial<
  Pick<AuthState, 'member' | 'tokens' | 'status'>
>

const noopStorage: Storage = {
  length: 0,
  clear() {},
  getItem() {
    return null
  },
  key() {
    return null
  },
  removeItem() {},
  setItem() {},
}

const sessionJSONStorage = createJSONStorage<PersistedAuthState>(() =>
  typeof window === 'undefined' ? noopStorage : window.sessionStorage
)

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        status: 'idle',
        async exchangeTokenAndPopulateMember() {
          set({ status: 'loading', error: undefined })

          try {
            let axiosRes

            try {
              axiosRes = await axios.post<AccessTokenResponse>(
                ACCESS_TOKEN_ENDPOINT,
                null,
                { timeout: AXIOS_TIMEOUT, withCredentials: true }
              )
            } catch (err) {
              if (axios.isAxiosError(err)) {
                const statusCode = err.response?.status
                if (
                  statusCode === STATUS_CODES.BAD_REQUEST ||
                  statusCode === STATUS_CODES.UNAUTHORIZED
                ) {
                  // Fail to get access token due to invalid id_token.
                  set({
                    status: 'unauthenticated',
                    member: undefined,
                    tokens: undefined,
                    error: undefined,
                  })
                  return
                }

                throw errors.helpers.annotateAxiosError(err)
              }

              throw err
            }

            const payload = axiosRes.data?.data

            if (!payload?.accessToken) {
              throw new Error('Fail to exchange access token')
            }

            const expiresAt =
              typeof payload.expiresAt === 'number'
                ? payload.expiresAt
                : Math.round(Date.now() / 1000) + 3600

            const member = await getMemberProfileByTwreporterUserId({
              twreporterUserId: payload.twreporterUserId,
              accessToken: payload.accessToken,
            })

            if (!member) {
              throw new Error('Fail to fetch member profile')
            }

            set({
              member: {
                ...member,
                avatar: {
                  id: member.avatar?.id ?? '',
                  url: member.avatar?.fileUrl ?? '',
                },
                joinedAt: member.createdAt,
              },
              tokens: { accessToken: payload.accessToken, expiresAt },
              status: 'authenticated',
              error: undefined,
            })
          } catch (_err) {
            const err = errors.helpers.wrap(
              _err,
              'AuthStoreError',
              'Error to exchangeTokenAndPopulateMember'
            )

            const msg = errors.helpers.printAll(err, {
              withStack: true,
              withPayload: true,
            })

            log(LogLevel.ERROR, msg)

            set({
              status: 'error',
              error: '登入失敗，請稍後再試。',
            })
          }
        },
        async fetchMember() {
          const { tokens, member } = get()
          if (!tokens?.accessToken || !member?.id) {
            return
          }

          try {
            const latest = await getMemberProfileByMemberId({
              memberId: member.id,
              accessToken: tokens.accessToken,
            })

            if (latest) {
              set({
                member: {
                  ...latest,
                  avatar: {
                    id: latest.avatar?.id ?? '',
                    url: latest.avatar?.fileUrl ?? '',
                  },
                  joinedAt: latest.createdAt,
                },
                status: 'authenticated',
                error: undefined,
              })
            }
          } catch (_err) {
            const err = _err instanceof Error ? _err : new Error(String(_err))
            log(
              LogLevel.ERROR,
              '[auth-store] fetchMember failed: ' + err.message
            )
          }
        },
        setAuth({ member, tokens }) {
          set({
            ...(member ? { member } : {}),
            ...(tokens ? { tokens } : {}),
            status: 'authenticated',
            error: undefined,
          })
        },
        clearAuth() {
          set({
            member: undefined,
            tokens: undefined,
            status: 'idle',
            error: undefined,
          })
        },
        async logout() {
          await axios.post(LOGOUT_ENDPOINT, null, {
            timeout: AXIOS_TIMEOUT,
            withCredentials: true,
          })
          get().clearAuth()
        },
      }),
      {
        name: 'kids-auth',
        storage: sessionJSONStorage,
        partialize: (state) => {
          if (state.status === 'authenticated') {
            return {
              member: state.member,
              tokens: state.tokens,
              status: state.status,
            }
          }
          return {}
        },
      }
    )
  )
)
