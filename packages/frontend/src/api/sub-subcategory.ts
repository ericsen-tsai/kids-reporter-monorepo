import { getSubSubcategoryPostsContentApi } from '@/api/content-api/sub-subcategory-posts'

export const getSubSubcategoryPosts = async ({
  slug,
  take,
  skip,
  traceHeaders,
}: {
  slug: string
  take?: number
  skip?: number
  traceHeaders?: Record<string, string>
}) => {
  return await getSubSubcategoryPostsContentApi({
    slug,
    take,
    skip,
    orderBy: 'publishedDate:desc',
    traceHeaders,
  })
}
