import gql from 'graphql-tag'

export const GET_MEMBER_PROFILE_QUERY = gql`
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
        fileUrl
      }
      createdAt
    }
  }
`

export const CREATE_MEMBER_AVATAR_MUTATION = gql`
  mutation CreateMemberAvatar($data: MemberAvatarCreateInput!) {
    item: createMemberAvatar(data: $data) {
      id
      name
    }
  }
`

export const UPDATE_MEMBER_PROFILE_MUTATION = gql`
  mutation UpdateMemberProfile(
    $where: MemberWhereUniqueInput!
    $data: MemberUpdateInput!
  ) {
    updateMember(where: $where, data: $data) {
      id
      name
      nickname
      contactEmail
      showBaodaozai
      essayQuestionCount
      avatar {
        id
      }
    }
  }
`

export const GET_MEMBER_POSTS_WITH_ANSWERS_QUERY = gql`
  query GetMemberPostsWithAnswers($take: Int, $nextCursor: String) {
    getMemberPostsWithAnswers(take: $take, cursor: $nextCursor)
  }
`

export const DELETE_MEMBER_AVATAR_MUTATION = gql`
  mutation DeleteMemberAvatar($where: MemberAvatarWhereUniqueInput!) {
    deleteMemberAvatar(where: $where) {
      id
    }
  }
`

export const GET_MEMBER_ESSAY_ANSWERS_HAS_LIKED_QUERY = gql`
  query GetMemberEssayAnswersHasLiked($essayAnswerIds: [ID!]!) {
    getMemberEssayAnswersHasLiked(essayAnswerIds: $essayAnswerIds) {
      essayAnswerId
      hasLiked
    }
  }
`
