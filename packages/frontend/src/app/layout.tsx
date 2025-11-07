import '../globals.css'

import { Footer } from '@kids-reporter/routing-ui'
import { GoogleTagManager } from '@next/third-parties/google'
import { Noto_Sans_TC } from 'next/font/google'

import Providers from '@/components/providers'
import {
  ADDITIONAL_MENU_ITEMS,
  DONATE_URL,
  PRIVACY_POLICY,
  SOCIAL_MEDIA_ITEMS,
} from '@/constants'

const GTM_ID = 'GTM-T37WZJ44'

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-noto-sans-tc',
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={notoSansTC.variable}>
      <GoogleTagManager gtmId={GTM_ID} />
      <body>
        <Providers>
          {children}
          <Footer
            socialMediaHrefs={SOCIAL_MEDIA_ITEMS.map((item) => item.href)}
            additionalMenuItems={ADDITIONAL_MENU_ITEMS}
            donateUrl={DONATE_URL}
            privacyPolicyUrl={PRIVACY_POLICY}
          />
        </Providers>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display: none; visibility: hidden;"></iframe>`,
          }}
        />
      </body>
    </html>
  )
}
