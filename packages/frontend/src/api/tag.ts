import {
  getTagMetaContentApi,
  getTagPostsContentApi,
} from '@/api/content-api/tag-collection'

export async function getTagMetaBySlug({
  slug,
  traceHeaders,
}: {
  slug: string
  traceHeaders?: Record<string, string>
}) {
  return await getTagMetaContentApi({ slug, traceHeaders })
}

export async function getTagPostsBySlugPaged(
  {
    slug,
    take,
    skip,
  }: {
    slug: string
    take?: number
    skip?: number
  },
  traceHeaders?: Headers | Record<string, string | undefined>
) {
  return await getTagPostsContentApi({
    slug,
    take,
    skip,
    orderBy: 'publishedDate:desc',
    traceHeaders,
  })
}
