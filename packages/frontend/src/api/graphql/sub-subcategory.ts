import gql from 'graphql-tag'

import { POST_CONTENT_FRAGMENT } from './fragments'

export const GET_SUB_SUBCATEGORY_POSTS_GQL = gql`
  ${POST_CONTENT_FRAGMENT}
  query GetSubSubcategoryPosts(
    $where: SubSubcategoryWhereUniqueInput!
    $take: Int
    $skip: Int
    $orderBy: [PostOrderByInput!]!
  ) {
    subSubcategory(where: $where) {
      relatedPosts(take: $take, skip: $skip, orderBy: $orderBy) {
        ...PostContent
      }
      relatedPostsCount
      subcategory {
        slug
        category {
          slug
        }
      }
    }
  }
`
