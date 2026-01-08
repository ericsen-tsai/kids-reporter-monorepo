import gql from 'graphql-tag'

export const POST_CONTENT_FRAGMENT = gql`
  fragment PostContent on Post {
    title
    slug
    ogDescription
    heroImage {
      resized {
        small
      }
    }
    subSubcategoriesOrdered {
      name
      subcategory {
        name
        category {
          slug
          themeColor
        }
      }
    }
    publishedDate
  }
`
