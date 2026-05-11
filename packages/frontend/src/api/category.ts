import {
  getCategoryMetadataContentApi,
  getCategoryPostsContentApi,
  getCategorySubcategoriesThemeContentApi,
} from '@/api/content-api/category-collection'

export const getCategoryPosts = async ({
  slug,
  take,
  skip,
}: {
  slug: string
  take?: number
  skip?: number
}) => {
  return await getCategoryPostsContentApi({ slug, take, skip })
}

export const getCategoryMetadata = async ({
  slug,
  subcategorySlug,
}: {
  slug: string
  subcategorySlug?: string
}) => {
  return await getCategoryMetadataContentApi({ slug, subcategorySlug })
}

export const getCategorySubcategoriesAndThemeColor = async (
  { slug }: { slug: string },
  traceHeaders?: Record<string, string>
) => {
  return await getCategorySubcategoriesThemeContentApi({ slug, traceHeaders })
}
