import '../globals.css'

import { Footer, HeaderProvider } from '@kids-reporter/routing-ui'

import {
  ADDITIONAL_MENU_ITEMS,
  DONATE_URL,
  POPULAR_KEYWORDS,
  PRIVACY_POLICY,
  SOCIAL_MEDIA_ITEMS,
} from '@/constants'
import StyledComponentsRegistry from '@/components/registry'
import '../globals.css'
import { GoogleTagManager } from '@next/third-parties/google'

const GTM_ID = 'GTM-T37WZJ44'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // TODO: get keywords from backend
  const keywords = POPULAR_KEYWORDS

  return (
    <html>
      <GoogleTagManager gtmId={GTM_ID} />
      <StyledComponentsRegistry>
        <HeaderProvider keywords={keywords}>
          <body>
            {children}
            <Footer
              socialMediaHrefs={SOCIAL_MEDIA_ITEMS.map((item) => item.href)}
              additionalMenuItems={ADDITIONAL_MENU_ITEMS}
              donateUrl={DONATE_URL}
              privacyPolicyUrl={PRIVACY_POLICY}
            />
            <noscript
              dangerouslySetInnerHTML={{
                __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display: none; visibility: hidden;"></iframe>`,
              }}
            />
          </body>
        </HeaderProvider>
      </StyledComponentsRegistry>
    </html>
  )
}
