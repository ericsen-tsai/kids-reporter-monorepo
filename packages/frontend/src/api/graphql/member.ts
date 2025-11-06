import gql from 'graphql-tag'

export const GET_MEMBER_PROFILE_GQL = gql`
  query GetMemberProfile($where: MemberWhereUniqueInput!) {
    member(where: $where) {
      id
      name
      email
      twreporter_user_id
      showBaodaozai
      essayQuestionCount
    }
  }
`
