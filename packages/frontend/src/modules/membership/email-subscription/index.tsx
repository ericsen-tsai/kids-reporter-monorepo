'use client'
import {
  Button,
  HeaderMobileBackButtonHrefSetter,
  useMediaQuery,
} from '@kids-reporter/routing-ui'
import Image from 'next/image'

import { NEWSLETTER_PREVIEW, NEWSLETTER_SUBSCRIPTION } from '@/constants'

import MembershipSideMenu from '../components/side-menu'

function EmailSubscription() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  return (
    <div className="mx-auto w-full bg-neutral-100 pt-6 pb-40 tablet:pt-8 desktop:px-12 desktop:pt-16 desktop:pb-50">
      <div className="mx-auto w-full max-w-300 tablet:grid tablet:grid-cols-12 tablet:gap-6 desktop:gap-8">
        <HeaderMobileBackButtonHrefSetter href="/member" />
        <div className="hidden tablet:col-span-2 tablet:block tablet:min-w-[150px]">
          <MembershipSideMenu />
        </div>
        <div className="flex flex-1 flex-col px-6 tablet:col-span-10 tablet:px-8 desktop:col-span-8 desktop:px-0">
          <h1 className="mb-6 prose-h4-small font-swei text-neutral-900 desktop:mb-8 desktop:prose-h4-large">
            訂閱電子報
          </h1>
          <div className="flex flex-col gap-5 rounded-2xl bg-white p-6 tablet:gap-6 tablet:p-8 hd:flex-row hd:items-center">
            <div className="flex flex-col items-center gap-5 tablet:flex-row">
              <div className="h-22 w-22 flex-shrink-0">
                <Image
                  src="/assets/images/newsletter-icon.svg"
                  alt="報導仔新聞聯絡簿"
                  width={88}
                  height={88}
                  className="h-full w-full"
                />
              </div>
              <div className="flex w-full flex-col gap-2">
                <div className="flex items-center gap-2">
                  <h2 className="prose-h6-large text-neutral-900">
                    報導仔新聞聯絡簿
                  </h2>
                  <span className="inline-flex items-center rounded bg-red-100 px-1.5 py-0.5 prose-p2 text-red-400">
                    每月
                  </span>
                </div>
                <p className="prose-p1 text-neutral-700">
                  兒少新聞平台《少年報導者》的最新專題和活動消息，就讓可愛的報導仔來告訴你！
                </p>
              </div>
            </div>
            <div className="flex w-full gap-4 tablet:ml-27 tablet:max-w-[230px] hd:ml-0">
              <Button
                variant="secondary"
                size={isMobile ? 36 : 44}
                className="flex-1"
                onClick={() => window.open(NEWSLETTER_PREVIEW, '_blank')}
              >
                預覽
              </Button>
              <Button
                variant="primary"
                size={isMobile ? 36 : 44}
                className="flex-1"
                onClick={() => window.open(NEWSLETTER_SUBSCRIPTION, '_blank')}
              >
                前往訂閱
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailSubscription
