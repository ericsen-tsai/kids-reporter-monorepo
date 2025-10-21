import { Header } from '@kids-reporter/routing-ui'

import {
  ADDITIONAL_MENU_ITEMS,
  DONATE_URL,
  MENU_ITEMS,
  SEARCH_PLACEHOLDER,
  SOCIAL_MEDIA_ITEMS,
  SUBSCRIBE_URL,
} from '@/constants'
import { Baodaozai, CallBaodaozaiProvider } from '@/services/call-baodaozai'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CallBaodaozaiProvider>
        <Header
          menuItems={MENU_ITEMS}
          additionalMenuItems={ADDITIONAL_MENU_ITEMS}
          socialMediaHrefs={SOCIAL_MEDIA_ITEMS.map((item) => item.href)}
          searchPlaceholder={SEARCH_PLACEHOLDER}
          subscribeUrl={SUBSCRIBE_URL}
          donateUrl={DONATE_URL}
        />
        <div className="flex grow">{children}</div>
        <Baodaozai />
      </CallBaodaozaiProvider>
    </>
  )
}
