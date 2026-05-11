/*
NOTE:
There is a bug of sitemap regeneration in Next.js below v13.5.4
https://github.com/vercel/next.js/issues/54057

BUT there is also a bug of non-conditional request above v13.5.4
(cdn caches 304 response & make blank pages)
https://github.com/vercel/next.js/issues/56018

Therefore, so far we can't upgrade to v13.5.4 due to #56018 & #54057 remains.
*/

import { MetadataRoute } from 'next'

import {
  getSitemapPostsContentApi,
  getSitemapProjectsContentApi,
} from '@/api/content-api/sitemaps'
import { KIDS_URL_ORIGIN } from '@/constants'
import envVars from '@/environment-variables'

export const revalidate = envVars.isProduction ? 86400 : 0 // 1 day

const fetchSitemaps = async (): Promise<
  { url: string; lastModified: Date }[]
> => {
  let sitemaps: { url: string; lastModified: Date }[] = []

  const postsRows = await getSitemapPostsContentApi({ sinceDays: 60 })
  const posts = postsRows.map((post) => ({
    url: `${KIDS_URL_ORIGIN}/article/${post.slug}`,
    lastModified: post.publishedDate
      ? new Date(post.publishedDate)
      : new Date(),
  }))
  if (posts) {
    sitemaps = [...posts]
  }

  const topicsRows = await getSitemapProjectsContentApi({ sinceDays: 60 })
  const topics = topicsRows.map((topic) => ({
    url: `${KIDS_URL_ORIGIN}/topic/${topic.slug}`,
    lastModified: topic.publishedDate
      ? new Date(topic.publishedDate)
      : new Date(),
  }))
  if (topics) {
    sitemaps = [...sitemaps, ...topics]
  }

  return sitemaps
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemaps = await fetchSitemaps()
  return sitemaps?.map((sitemap) => {
    return {
      url: sitemap.url,
      lastModified: sitemap.lastModified,
    }
  })
}
