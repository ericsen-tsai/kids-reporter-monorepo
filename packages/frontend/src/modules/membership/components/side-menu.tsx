'use client'
import { cn } from '@kids-reporter/routing-ui'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import Divider from '@/components/divider'
import { useHydratedAuthStore } from '@/services/auth/use-hydrated-auth-store'

import { MEMBERSHIP_MENU_ITEMS } from '../constants'

function MembershipSideMenu() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/member') {
      return pathname === '/member'
    }
    return pathname?.startsWith(href)
  }

  const { logout } = useHydratedAuthStore()
  const router = useRouter()
  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch {
      toast.error('登出失敗')
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-0">
        {MEMBERSHIP_MENU_ITEMS.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'w-full px-6 py-2 text-left prose-p1 transition-all duration-300 tablet:px-8 desktop:px-4',
                'bg-neutral-100 text-neutral-900',
                'hover:bg-black/5 active:bg-black/10',
                active && 'text-red-400'
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </div>

      <Divider className="mx-auto w-[calc(100%-48px)] tablet:w-[calc(100%-64px)] desktop:w-full" />

      <button
        onClick={handleLogout}
        className={cn(
          'w-full cursor-pointer px-6 py-2 text-left prose-p1 transition-all duration-300 tablet:px-8 desktop:px-4',
          'bg-neutral-100 text-neutral-900',
          'hover:bg-black/5 active:bg-black/10'
        )}
      >
        登出
      </button>
    </div>
  )
}

export default MembershipSideMenu
