import { getSubSubcategoryPostsContentApi } from '@/api/content-api/sub-subcategory-posts'

export const getSubSubcategoryPosts = async ({
  slug,
  take,
  skip,
}: {
  slug: string
  take?: number
  skip?: number
}) => {
  return await getSubSubcategoryPostsContentApi({
    slug,
    take,
    skip,
    orderBy: 'publishedDate:desc',
  })
}
