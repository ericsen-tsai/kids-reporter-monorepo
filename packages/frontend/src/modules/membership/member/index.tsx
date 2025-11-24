'use client'
import { useMediaQuery } from '@kids-reporter/routing-ui'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import MembershipSideMenu from '../components/side-menu'
import UserAvatar from '../components/user-avatar'
import { MEMBERSHIP_MENU_ITEMS, MOCK_USER } from '../constants'

function Member() {
  const user = MOCK_USER

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
          <UserAvatar avatar={user.avatar} name={user.name} />
          <div className="flex flex-col items-center gap-0">
            <h2 className="text-center prose-h5-small text-neutral-900">
              {user.name}
            </h2>
            <p className="mt-0 text-center prose-p1 text-neutral-700">
              {user.id}
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
