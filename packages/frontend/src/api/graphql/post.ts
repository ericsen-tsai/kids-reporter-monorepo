import gql from 'graphql-tag'

import { POST_CONTENT_FRAGMENT } from './fragments'

export const GET_LATEST_POSTS_GQL = gql`
  query GetLatestPosts($orderBy: [PostOrderByInput!]!, $take: Int) {
    posts(orderBy: $orderBy, take: $take) {
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
  }
`

export const GET_POST_GQL = gql`
  ${POST_CONTENT_FRAGMENT}
  query GetPost(
    $where: PostWhereUniqueInput!
    $orderBy: [NewsReadingGroupItemOrderByInput!]!
    $take: Int
    $relatedPostsWhere: PostWhereInput!
  ) {
    post(where: $where) {
      opening
      title
      newsReadingGroup {
        items(orderBy: $orderBy) {
          name
          embedCode
        }
      }
      brief
      content
      publishedDate
      heroImage {
        imageFile {
          width
          height
        }
        resized {
          small
          medium
          large
        }
      }
      heroCaption
      authors {
        avatar {
          resized {
            tiny
          }
        }
        bio
        id
        name
        slug
      }
      authorsJSON
      tagsOrdered {
        name
        slug
      }
      TWReporterRelatedPostsJSON
      relatedPostsOrdered {
        title
        slug
        publishedDate
        heroImage {
          resized {
            small
            medium
            large
          }
        }
        ogDescription
        subSubcategoriesOrdered {
          name
          slug
          subcategory {
            name
            slug
            category {
              name
              slug
              themeColor
            }
          }
        }
      }
      subtitle
      subSubcategoriesOrdered {
        name
        slug
        subcategory {
          name
          slug
          category {
            name
            slug
            themeColor
          }
        }
      }
      mainProject {
        title
        slug
      }
      projects {
        title
        slug
        relatedPosts(take: $take, where: $relatedPostsWhere) {
          ...PostContent
        }
      }
      postEssayQuestions {
        id
        title
        hint
      }
      postChoiceQuestions {
        id
        title
        options
        reason
      }
    }
  }
`

export const GET_POST_META_GQL = gql`
  query GetPostMeta($where: PostWhereUniqueInput!) {
    post(where: $where) {
      publishedDate
      ogDescription
      ogTitle
      ogImage {
        resized {
          small
        }
      }
      subSubcategoriesOrdered {
        name
        slug
        subcategory {
          name
          slug
          category {
            name
            slug
            themeColor
          }
        }
      }
    }
  }
`
