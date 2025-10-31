import {
  GetSubSubcategoryPostsQuery,
  GetSubSubcategoryPostsQueryVariables,
} from '__generated__/operations/sub-subcategory.generated'

import { sendGQLRequest } from '@/utils'

import { GET_SUB_SUBCATEGORY_POSTS_GQL } from './graphql/sub-subcategory'

export const getSubSubcategoryPosts = async (
  variables: GetSubSubcategoryPostsQueryVariables
) => {
  const response = await sendGQLRequest<GetSubSubcategoryPostsQuery>({
    query: GET_SUB_SUBCATEGORY_POSTS_GQL,
    variables,
  })
  return response?.data?.data?.subSubcategory
}
