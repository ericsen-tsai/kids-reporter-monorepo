import {
  getCategoryMetadataContentApi,
  getCategoryPostsContentApi,
  getCategorySubcategoriesThemeContentApi,
} from '@/api/content-api/category-collection'

export const getCategoryPosts = async ({
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
  return await getCategoryPostsContentApi({ slug, take, skip, traceHeaders })
}

export const getCategoryMetadata = async ({
  slug,
  subcategorySlug,
  traceHeaders,
}: {
  slug: string
  subcategorySlug?: string
  traceHeaders?: Record<string, string>
}) => {
  return await getCategoryMetadataContentApi({
    slug,
    subcategorySlug,
    traceHeaders,
  })
}

export const getCategorySubcategoriesAndThemeColor = async (
  { slug }: { slug: string },
  traceHeaders?: Record<string, string>
) => {
  return await getCategorySubcategoriesThemeContentApi({ slug, traceHeaders })
}
