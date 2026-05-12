import { getSubcategoriesContentApi } from '@/api/content-api/subcategories'
import { getSubcategoryPostsContentApi } from '@/api/content-api/subcategory-posts'

export const getSubcategoryPosts = async ({
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
  return await getSubcategoryPostsContentApi({
    slug,
    take,
    skip,
    traceHeaders,
  })
}

export const getSubcategories = async () => {
  return await getSubcategoriesContentApi()
}
