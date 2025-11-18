import gql from 'graphql-tag'

export const GET_MEMBER_PROFILE_GQL = gql`
  query GetMemberProfile($where: MemberWhereUniqueInput!) {
    member(where: $where) {
      id
      name
      email
      nickname
      contactEmail
      twreporter_user_id
      showBaodaozai
      essayQuestionCount
      avatar {
        id
        resized {
          medium
        }
      }
      createdAt
    }
  }
`

export const UPDATE_MEMBER_PROFILE_GQL = gql`
  mutation UpdateMemberProfile(
    $where: MemberWhereUniqueInput!
    $data: MemberUpdateInput!
  ) {
    updateMember(where: $where, data: $data) {
      id
      name
      nickname
      contactEmail
      avatar {
        id
      }
    }
  }
`
