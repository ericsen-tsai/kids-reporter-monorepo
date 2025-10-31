'use client'

import { useEffect } from 'react'

import { useHydratedAuthStore } from '@/services/auth/use-hydrated-auth-store'

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { hydrated, tokens, status, exchangeTokenAndPopulateMember } =
    useHydratedAuthStore()

  const expiresAtMs = tokens?.expiresAt

  useEffect(() => {
    if (!hydrated) {
      // wait for sessionStorage hydration
      return
    }

    if (status === 'loading') {
      return
    }

    if (
      status === 'idle' ||
      (expiresAtMs && expiresAtMs <= Math.round(Date.now() / 1000))
    ) {
      exchangeTokenAndPopulateMember()
    }
  }, [exchangeTokenAndPopulateMember, expiresAtMs, status, hydrated])

  return <>{children}</>
}

export { AuthProvider }
