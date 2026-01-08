'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

type LoginProps = {
  iframeSrc: string
  showToastToLogin: boolean
}

function Login({ iframeSrc, showToastToLogin }: LoginProps) {
  useEffect(() => {
    if (showToastToLogin) {
      // Use requestAnimationFrame to ensure Toaster is ready after DOM is painted
      const frameId = requestAnimationFrame(() => {
        toast.success('請先登入')
      })
      return () => cancelAnimationFrame(frameId)
    }
    return undefined
  }, [showToastToLogin])
  return (
    <iframe
      className="h-[calc(100vh-var(--mobile-header-height))] w-full desktop:h-[calc(100vh-var(--desktop-header-height))]"
      src={iframeSrc}
      title="Login widget"
      allow="clipboard-read; clipboard-write"
    />
  )
}

export default Login
