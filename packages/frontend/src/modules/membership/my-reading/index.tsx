'use client'
import { HeaderMobileBackButtonHrefSetter } from '@kids-reporter/routing-ui'

import MembershipSideMenu from '../components/side-menu'

function MyReading() {
  return (
    <div className="mx-auto w-full bg-neutral-100 pt-6 pb-40 desktop:px-12">
      <div className="mx-auto flex w-full max-w-300">
        <HeaderMobileBackButtonHrefSetter href="/member" />
        <div className="hidden tablet:block">
          <MembershipSideMenu />
        </div>
      </div>
    </div>
  )
}

export default MyReading
