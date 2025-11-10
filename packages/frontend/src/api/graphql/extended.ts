import gql from 'graphql-tag'

export const GET_MEMBER_POSTS_WITH_ANSWERS_GQL = gql`
  query GetMemberPostsWithAnswers($memberId: ID!, $take: Int, $skip: Int) {
    getMemberPostsWithAnswers(memberId: $memberId, take: $take, skip: $skip)
  }
`
