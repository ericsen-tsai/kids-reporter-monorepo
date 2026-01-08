import { MetadataRoute } from 'next'

import { KIDS_URL_ORIGIN } from '@/constants'
import envVars from '@/environment-variables'

const devConfig = {
  rules: {
    userAgent: '*',
    disallow: '/',
  },
}

const prodConfig = {
  rules: {
    userAgent: '*',
    allow: '/',
  },
  sitemap: `${KIDS_URL_ORIGIN}/sitemap.xml`,
}

export default function robots(): MetadataRoute.Robots {
  return envVars.isProduction ? prodConfig : devConfig
}
