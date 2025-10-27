import gql from 'graphql-tag'

import { POST_CONTENT_FRAGMENT } from './fragments'

export const GET_SUBCATEGORY_POSTS_GQL = gql`
  ${POST_CONTENT_FRAGMENT}
  query GetSubcategoryPosts($where: SubcategoryWhereUniqueInput!, $take: Int) {
    subcategory(where: $where) {
      relatedPosts(take: $take) {
        ...PostContent
      }
    }
  }
`
