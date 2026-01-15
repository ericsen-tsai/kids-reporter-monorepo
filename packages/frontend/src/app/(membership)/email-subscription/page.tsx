import { Metadata } from 'next'

import { ContentType, KIDS_URL_ORIGIN } from '@/constants'
import EmailSubscriptionModule from '@/modules/membership/email-subscription'

export const metadata: Metadata = {
  title: '訂閱電子報 - 少年報導者 The Reporter for Kids',
  alternates: {
    canonical: `${KIDS_URL_ORIGIN}/email-subscription`,
  },
  openGraph: {
    title: '訂閱電子報 - 少年報導者 The Reporter for Kids',
    description:
      '《少年報導者》是由非營利媒體《報導者》針對兒少打造的深度新聞報導品牌，與兒童和少年一起理解世界，參與未來。在訂閱電子報頁，你可以預覽或設定電子報的訂閱。',
    url: `${KIDS_URL_ORIGIN}/email-subscription`,
    type: ContentType.ARTICLE,
  },
}

function EmailSubscriptionPage() {
  return <EmailSubscriptionModule />
}

export default EmailSubscriptionPage
