import gql from 'graphql-tag'

import { POST_CONTENT_FRAGMENT } from './fragments'

export const GET_CATEGORY_POSTS_GQL = gql`
  ${POST_CONTENT_FRAGMENT}
  query GetCategoryPosts(
    $where: CategoryWhereUniqueInput!
    $take: Int
    $skip: Int
  ) {
    category(where: $where) {
      relatedPosts(take: $take, skip: $skip) {
        ...PostContent
      }
      relatedPostsCount
    }
  }
`

export const GET_CATEGORY_METADATA_GQL = gql`
  query GetCategoryMetadata(
    $categoryWhere: CategoryWhereUniqueInput!
    $subcategoryWhere: SubcategoryWhereInput!
  ) {
    category(where: $categoryWhere) {
      ogTitle
      ogDescription
      ogImage {
        resized {
          medium
        }
      }
      subcategories(where: $subcategoryWhere) {
        ogTitle
        ogDescription
        ogImage {
          resized {
            medium
          }
        }
      }
    }
  }
`

export const GET_CATEGORY_SUBCATEGORIES_AND_THEME_COLOR_GQL = gql`
  query GetCategorySubcategoriesAndThemeColor(
    $where: CategoryWhereUniqueInput!
  ) {
    category(where: $where) {
      subcategories {
        name
        slug
      }
      themeColor
    }
  }
`
