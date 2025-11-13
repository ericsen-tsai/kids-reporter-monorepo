'use client'

import { HeaderIsLoggedInSetter } from '@kids-reporter/routing-ui'

import envVars from '@/environment-variables'
import { useHydratedAuthStore } from '@/services/auth/use-hydrated-auth-store'

function AuthHeaderLoggedInSetter() {
  const { member } = useHydratedAuthStore()
  const isLoggedIn = !!member

  const loginUrl = `${envVars.loginUrl}?destination=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`

  return <HeaderIsLoggedInSetter isLoggedIn={isLoggedIn} loginUrl={loginUrl} />
}

export default AuthHeaderLoggedInSetter
