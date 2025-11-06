'use client'

import { HeaderIsLoggedInSetter } from '@kids-reporter/routing-ui'

import { useHydratedAuthStore } from '@/services/auth/use-hydrated-auth-store'

function AuthHeaderLoggedInSetter() {
  const { member } = useHydratedAuthStore()
  const isLoggedIn = !!member
  return <HeaderIsLoggedInSetter isLoggedIn={isLoggedIn} />
}

export default AuthHeaderLoggedInSetter
