import '../globals.css'

import { Footer, HeaderProvider } from '@kids-reporter/routing-ui'
import Script from 'next/script'

import BackToTop from '@/components/back-to-top'
import StyledComponentsRegistry from '@/components/registry'
import {
  ADDITIONAL_MENU_ITEMS,
  DONATE_URL,
  POPULAR_KEYWORDS,
  PRIVACY_POLICY,
  SOCIAL_MEDIA_ITEMS,
} from '@/constants'

const gtmID = 'GTM-T37WZJ44'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // TODO: get keywords from backend
  const keywords = POPULAR_KEYWORDS

  return (
    <html>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmID}');
        `}
      </Script>
      <StyledComponentsRegistry>
        <HeaderProvider keywords={keywords}>
          <body>
            {children}
            <BackToTop />
            <Footer
              socialMediaHrefs={SOCIAL_MEDIA_ITEMS.map((item) => item.href)}
              additionalMenuItems={ADDITIONAL_MENU_ITEMS}
              donateUrl={DONATE_URL}
              privacyPolicyUrl={PRIVACY_POLICY}
            />
            <noscript
              dangerouslySetInnerHTML={{
                __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmID}" height="0" width="0" style="display: none; visibility: hidden;"></iframe>`,
              }}
            />
          </body>
        </HeaderProvider>
      </StyledComponentsRegistry>
    </html>
  )
}
