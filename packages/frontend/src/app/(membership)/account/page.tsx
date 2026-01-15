import { Metadata } from 'next'

import { ContentType, KIDS_URL_ORIGIN } from '@/constants'
import AccountModule from '@/modules/membership/account'

export const metadata: Metadata = {
  title: '個人資料 - 少年報導者 The Reporter for Kids',
  alternates: {
    canonical: `${KIDS_URL_ORIGIN}/account`,
  },
  openGraph: {
    title: '個人資料 - 少年報導者 The Reporter for Kids',
    description:
      '《少年報導者》是由非營利媒體《報導者》針對兒少打造的深度新聞報導品牌，與兒童和少年一起理解世界，參與未來。在個人資料頁，你可以設定你的全名、暱稱和連絡信箱。',
    url: `${KIDS_URL_ORIGIN}/account`,
    type: ContentType.ARTICLE,
  },
}

function AccountPage() {
  return <AccountModule />
}

export default AccountPage
