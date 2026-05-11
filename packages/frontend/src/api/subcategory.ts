import { getSubcategoriesContentApi } from '@/api/content-api/subcategories'
import { getSubcategoryPostsContentApi } from '@/api/content-api/subcategory-posts'

export const getSubcategoryPosts = async ({
  slug,
  take,
  skip,
}: {
  slug: string
  take?: number
  skip?: number
}) => {
  return await getSubcategoryPostsContentApi({
    slug,
    take,
    skip,
  })
}

export const getSubcategories = async () => {
  return await getSubcategoriesContentApi()
}
