import { Metadata } from 'next'

import { ContentType, KIDS_URL_ORIGIN } from '@/constants'
import MemberModule from '@/modules/membership/member'

export const metadata: Metadata = {
  title: '會員中心 - 少年報導者 The Reporter for Kids',
  alternates: {
    canonical: `${KIDS_URL_ORIGIN}/member`,
  },
  openGraph: {
    title: '會員中心 - 少年報導者 The Reporter for Kids',
    description:
      '《少年報導者》是由非營利媒體《報導者》針對兒少打造的深度新聞報導品牌，與兒童和少年一起理解世界，參與未來。在會員中心頁，你可以管理你的個人資料、我的回答、閱讀設定和訂閱電子報。',
    url: `${KIDS_URL_ORIGIN}/member`,
    type: ContentType.ARTICLE,
  },
}

export default function MemberPage() {
  return <MemberModule />
}
