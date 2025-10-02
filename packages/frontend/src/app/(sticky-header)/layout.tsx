import { Header } from '@kids-reporter/routing-ui'
import TopDetector from '@/components/top-detector'
import {
  MENU_ITEMS,
  ADDITIONAL_MENU_ITEMS,
  SOCIAL_MEDIA_ITEMS,
  SEARCH_PLACEHOLDER,
  SUBSCRIBE_URL,
  DONATE_URL,
} from '@/constants'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header
        menuItems={MENU_ITEMS}
        additionalMenuItems={ADDITIONAL_MENU_ITEMS}
        socialMediaHrefs={SOCIAL_MEDIA_ITEMS.map((item) => item.href)}
        searchPlaceholder={SEARCH_PLACEHOLDER}
        subscribeUrl={SUBSCRIBE_URL}
        donateUrl={DONATE_URL}
      />
      <TopDetector />
      <div className="flex grow">{children}</div>
    </>
  )
}
