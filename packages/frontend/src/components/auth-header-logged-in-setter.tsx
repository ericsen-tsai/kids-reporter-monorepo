'use client'

import { HeaderIsLoggedInSetter } from '@kids-reporter/routing-ui'
import { useMemo } from 'react'

import { useHydratedAuthStore } from '@/services/auth/use-hydrated-auth-store'
import getLoginUrl from '@/utils/get-login-url'

function AuthHeaderLoggedInSetter() {
  const { member } = useHydratedAuthStore()
  const isLoggedIn = !!member

  const loginUrl = useMemo(() => getLoginUrl(), [])

  return <HeaderIsLoggedInSetter isLoggedIn={isLoggedIn} loginUrl={loginUrl} />
}

export default AuthHeaderLoggedInSetter
