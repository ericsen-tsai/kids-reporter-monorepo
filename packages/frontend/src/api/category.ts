import {
  GetCategoryPostsQuery,
  GetCategoryPostsQueryVariables,
} from '__generated__/operations/category.generated'

import { sendGQLRequest } from '@/utils'

import { GET_CATEGORY_POSTS_GQL } from './graphql/category'

export const getCategoryPosts = async (
  variables: GetCategoryPostsQueryVariables
) => {
  const response = await sendGQLRequest<GetCategoryPostsQuery>({
    query: GET_CATEGORY_POSTS_GQL,
    variables,
  })
  return (
    response?.data?.data?.category?.relatedPosts?.filter((post) => !!post) ?? []
  )
}
