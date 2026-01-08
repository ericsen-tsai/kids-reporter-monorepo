import gql from 'graphql-tag'

export const GET_MEMBER_POSTS_WITH_ANSWERS_GQL = gql`
  query GetMemberPostsWithAnswers($take: Int, $nextCursor: String) {
    getMemberPostsWithAnswers(take: $take, cursor: $nextCursor)
  }
`

export const GET_MEMBER_ESSAY_ANSWERS_HAS_LIKED_GQL = gql`
  query GetMemberEssayAnswersHasLiked($essayAnswerIds: [ID!]!) {
    getMemberEssayAnswersHasLiked(essayAnswerIds: $essayAnswerIds) {
      essayAnswerId
      hasLiked
    }
  }
`
