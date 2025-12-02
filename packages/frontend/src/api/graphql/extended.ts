import gql from 'graphql-tag'

export const GET_MEMBER_POSTS_WITH_ANSWERS_GQL = gql`
  query GetMemberPostsWithAnswers(
    $memberId: ID!
    $take: Int
    $nextCursor: String
  ) {
    getMemberPostsWithAnswers(
      memberId: $memberId
      take: $take
      cursor: $nextCursor
    )
  }
`

export const GET_MEMBER_ESSAY_ANSWERS_HAS_LIKED_GQL = gql`
  query GetMemberEssayAnswersHasLiked($memberId: ID!, $answerIds: [ID!]!) {
    getMemberEssayAnswersHasLiked(memberId: $memberId, answerIds: $answerIds) {
      answerId
      hasLiked
    }
  }
`
