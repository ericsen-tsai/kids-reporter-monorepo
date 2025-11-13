'use client'
import { useMediaQuery } from '@kids-reporter/routing-ui'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import MembershipSideMenu from '../components/side-menu'
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
      <div className="mx-auto flex w-full max-w-300 flex-col items-center gap-8 pt-6 pb-40 tablet:items-start tablet:pt-8 desktop:pt-16 desktop:pb-50">
        <div className="flex w-full flex-col items-center gap-4 tablet:hidden">
          <div className="h-[136px] w-[136px] overflow-hidden rounded-full">
            <Image
              width={136}
              height={136}
              src={user.avatar}
              alt={user.name}
              className="h-full w-full bg-white object-cover"
            />
          </div>
          <div className="flex flex-col items-center gap-0">
            <h2 className="text-center prose-h5-small text-neutral-900">
              {user.name}
            </h2>
            <p className="mt-0 text-center prose-p1 text-neutral-700">
              {user.id}
            </p>
          </div>
        </div>

        <MembershipSideMenu />
      </div>
    </div>
  )
}

export default Member
