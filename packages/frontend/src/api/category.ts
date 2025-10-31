import {
  GetCategoryMetadataQuery,
  GetCategoryMetadataQueryVariables,
  GetCategoryPostsQuery,
  GetCategoryPostsQueryVariables,
  GetCategorySubcategoriesAndThemeColorQuery,
  GetCategorySubcategoriesAndThemeColorQueryVariables,
} from '__generated__/operations/category.generated'

import { sendGQLRequest } from '@/utils'

import {
  GET_CATEGORY_METADATA_GQL,
  GET_CATEGORY_POSTS_GQL,
  GET_CATEGORY_SUBCATEGORIES_AND_THEME_COLOR_GQL,
} from './graphql/category'

export const getCategoryPosts = async (
  variables: GetCategoryPostsQueryVariables
) => {
  const response = await sendGQLRequest<GetCategoryPostsQuery>({
    query: GET_CATEGORY_POSTS_GQL,
    variables,
  })
  return response?.data?.data?.category
}

export const getCategoryMetadata = async (
  variables: GetCategoryMetadataQueryVariables
) => {
  const response = await sendGQLRequest<GetCategoryMetadataQuery>({
    query: GET_CATEGORY_METADATA_GQL,
    variables,
  })
  return response?.data?.data?.category
}

export const getCategorySubcategoriesAndThemeColor = async (
  variables: GetCategorySubcategoriesAndThemeColorQueryVariables
) => {
  const response =
    await sendGQLRequest<GetCategorySubcategoriesAndThemeColorQuery>({
      query: GET_CATEGORY_SUBCATEGORIES_AND_THEME_COLOR_GQL,
      variables,
    })
  return response?.data?.data?.category
}
