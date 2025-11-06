import { Header } from '@kids-reporter/routing-ui'

import AuthHeaderLoggedInSetter from '@/components/auth-header-logged-in-setter'
import ScrollUpBaodaozaiEventTrigger from '@/components/scroll-up-baodaozai-event-trigger'
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
        <AuthHeaderLoggedInSetter />
        <div className="flex w-full grow">{children}</div>
        <Baodaozai />
        <ScrollUpBaodaozaiEventTrigger />
      </CallBaodaozaiProvider>
    </>
  )
}
