import gql from 'graphql-tag'

import { POST_CONTENT_FRAGMENT } from './fragments'

export const GET_CATEGORY_POSTS_GQL = gql`
  ${POST_CONTENT_FRAGMENT}
  query GetCategoryPosts($where: CategoryWhereUniqueInput!, $take: Int) {
    category(where: $where) {
      relatedPosts(take: $take) {
        ...PostContent
      }
    }
  }
`
