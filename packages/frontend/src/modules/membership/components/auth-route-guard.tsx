'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useHydratedAuthStore } from '@/services/auth/use-hydrated-auth-store'
import getLoginUrl from '@/utils/get-login-url'

type AuthRouteGuardProps = {
  children: React.ReactNode
}

function AuthRouteGuard({ children }: AuthRouteGuardProps) {
  const { hydrated, status, member } = useHydratedAuthStore()
  const router = useRouter()

  const hasCheckedAuth = [
    'authenticated',
    'unauthenticated',
    'error',
    'logged_out',
  ].includes(status)

  const isAuthenticating = !hydrated || !hasCheckedAuth

  useEffect(() => {
    if (isAuthenticating) {
      return
    }

    if (status === 'logged_out') {
      return
    }

    if (status === 'unauthenticated' || status === 'error' || !member) {
      router.push(getLoginUrl())
      return
    }
  }, [isAuthenticating, status, member, router])

  if (
    isAuthenticating ||
    status === 'unauthenticated' ||
    status === 'logged_out'
  ) {
    return (
      <div className="h-[calc(100dvh-var(--mobile-header-height))] w-full desktop:h-[calc(100dvh-var(--desktop-header-height))]"></div>
    )
  }

  return <>{children}</>
}

export default AuthRouteGuard
