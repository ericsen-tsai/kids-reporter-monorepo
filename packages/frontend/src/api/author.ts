import { getAuthorAvatarBySlugContentApi } from '@/api/content-api/author-avatar'
import {
  getAuthorMetaContentApi,
  getAuthorPostsContentApi,
} from '@/api/content-api/author-collection'
import { DEFAULT_AVATAR } from '@/constants'

export async function getAuthorAvatarBySlug({
  slug,
}: {
  slug: string
}): Promise<string> {
  const tiny = await getAuthorAvatarBySlugContentApi({ slug })
  return tiny || DEFAULT_AVATAR
}

export async function getAuthorMetaBySlug({ slug }: { slug: string }) {
  return await getAuthorMetaContentApi({ slug })
}

export async function getAuthorPostsBySlugPaged(
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
  const th =
    traceHeaders && !(traceHeaders instanceof Headers)
      ? (Object.fromEntries(
          Object.entries(traceHeaders).filter(
            (e): e is [string, string] => typeof e[1] === 'string'
          )
        ) as Record<string, string>)
      : undefined
  return await getAuthorPostsContentApi({
    slug,
    take,
    skip,
    orderBy: 'publishedDate:desc',
    traceHeaders: th,
  })
}
