import gql from 'graphql-tag'

import { POST_CONTENT_FRAGMENT } from './fragments'

export const GET_EDITOR_PICKS_SETTINGS_GQL = gql`
  ${POST_CONTENT_FRAGMENT}
  query GetEditorPicksSettings($take: Int) {
    editorPicksSettings(take: $take) {
      editorPicksOfPostsOrdered {
        ...PostContent
      }
      editorPicksOfTags {
        name
        slug
      }
    }
  }
`
