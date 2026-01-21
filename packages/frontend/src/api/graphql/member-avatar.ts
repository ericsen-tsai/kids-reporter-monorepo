import gql from 'graphql-tag'

export const CREATE_MEMBER_AVATAR_MUTATION = gql`
  mutation CreateMemberAvatar($data: MemberAvatarCreateInput!) {
    item: createMemberAvatar(data: $data) {
      id
      name
    }
  }
`

export const DELETE_MEMBER_AVATAR_MUTATION = gql`
  mutation DeleteMemberAvatar($where: MemberAvatarWhereUniqueInput!) {
    deleteMemberAvatar(where: $where) {
      id
    }
  }
`
