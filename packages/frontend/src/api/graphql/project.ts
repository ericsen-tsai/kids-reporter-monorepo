import gql from 'graphql-tag'

export const GET_TOPIC_PROJECTS_GQL = gql`
  query GetTopicProjects($orderBy: [ProjectOrderByInput!]!, $take: Int) {
    projects(orderBy: $orderBy, take: $take) {
      title
      subtitle
      slug
      heroImage {
        resized {
          small
        }
      }
    }
  }
`
