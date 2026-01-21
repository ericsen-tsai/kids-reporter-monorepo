'use client'
import { useEffect, useState } from 'react'

import { useAuthStore } from '@/services/auth/auth-store'

export const useHydratedAuthStore = () => {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true)
    })

    // store might be already hydrated
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true)
    }
    return unsub
  }, [])

  return {
    hydrated,
    ...useAuthStore(),
  }
}
