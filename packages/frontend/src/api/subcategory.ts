import {
  GetSubcategoryPostsQuery,
  GetSubcategoryPostsQueryVariables,
} from '__generated__/operations/subcategory.generated'

import { sendGQLRequest } from '@/utils'

import { GET_SUBCATEGORY_POSTS_GQL } from './graphql/subcategory'

export const getSubcategoryPosts = async (
  variables: GetSubcategoryPostsQueryVariables
) => {
  const response = await sendGQLRequest<GetSubcategoryPostsQuery>({
    query: GET_SUBCATEGORY_POSTS_GQL,
    variables,
  })
  return (
    response?.data?.data?.subcategory?.relatedPosts?.filter((post) => !!post) ??
    []
  )
}
