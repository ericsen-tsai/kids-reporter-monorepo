'use client'
import { useMediaQuery } from '@kids-reporter/routing-ui'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useHydratedAuthStore } from '@/services/auth/use-hydrated-auth-store'

import MembershipSideMenu from '../components/side-menu'
import UserAvatar from '../components/user-avatar'
import { MEMBERSHIP_MENU_ITEMS } from '../constants'

function Member() {
  const { member } = useHydratedAuthStore()

  const isMobile = useMediaQuery('(max-width: 768px)')
  const router = useRouter()

  useEffect(() => {
    if (isMobile === false) {
      router.replace(MEMBERSHIP_MENU_ITEMS[0].href)
    }
  }, [isMobile, router])

  return (
    <div className="w-full bg-neutral-100 desktop:px-12">
      <div className="mx-auto flex w-full max-w-300 flex-col items-center gap-8 pt-6 pb-40 tablet:grid tablet:grid-cols-12 tablet:items-start tablet:gap-6 tablet:pt-8 desktop:gap-8 desktop:pt-16 desktop:pb-50">
        <div className="flex w-full flex-col items-center gap-4 tablet:hidden">
          <UserAvatar
            avatar={member?.avatar?.url ?? ''}
            name={member?.name ?? ''}
          />
          <div className="flex flex-col items-center gap-0">
            <h2 className="text-center prose-h5-small text-neutral-900">
              {member?.name ?? ''}
            </h2>
            <p className="mt-0 text-center prose-p1 text-neutral-700">
              {member?.id ?? ''}
            </p>
          </div>
        </div>

        <div className="w-full tablet:col-span-2 tablet:min-w-[150px]">
          <MembershipSideMenu />
        </div>
      </div>
    </div>
  )
}

export default Member
