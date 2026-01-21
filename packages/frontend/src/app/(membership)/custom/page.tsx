import { Metadata } from 'next'

import { ContentType, KIDS_URL_ORIGIN } from '@/constants'
import CustomModule from '@/modules/membership/custom'

export const metadata: Metadata = {
  title: '閱讀設定 - 少年報導者 The Reporter for Kids',
  alternates: {
    canonical: `${KIDS_URL_ORIGIN}/custom`,
  },
  openGraph: {
    title: '閱讀設定 - 少年報導者 The Reporter for Kids',
    description:
      '《少年報導者》是由非營利媒體《報導者》針對兒少打造的深度新聞報導品牌，與兒童和少年一起理解世界，參與未來。在閱讀設定頁，你可以調整屬於自己偏好的閱讀模式。',
    url: `${KIDS_URL_ORIGIN}/custom`,
    type: ContentType.ARTICLE,
  },
}

function CustomPage() {
  return <CustomModule />
}

export default CustomPage
