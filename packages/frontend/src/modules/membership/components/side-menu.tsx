'use client'
import { cn } from '@kids-reporter/routing-ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { MEMBERSHIP_MENU_ITEMS } from '../constants'

function MembershipSideMenu() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/member') {
      return pathname === '/member'
    }
    return pathname?.startsWith(href)
  }
  return (
    <div className="flex w-full flex-col gap-4 tablet:max-w-40">
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

      <div className="mx-auto h-px w-[calc(100%-48px)] bg-neutral-200 tablet:w-[calc(100%-64px)] desktop:w-[calc(100%-32px)]" />

      <Link
        href="/logout"
        className={cn(
          'w-full px-6 py-2 text-left prose-p1 transition-all duration-300 tablet:px-8 desktop:px-4',
          'bg-neutral-100 text-neutral-900',
          'hover:bg-black/5 active:bg-black/10'
        )}
      >
        登出
      </Link>
    </div>
  )
}

export default MembershipSideMenu
