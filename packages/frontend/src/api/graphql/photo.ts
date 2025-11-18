import gql from 'graphql-tag'

export const CREATE_PHOTO_MUTATION = gql`
  mutation CreatePhoto($data: PhotoCreateInput!) {
    item: createPhoto(data: $data) {
      id
      label: name
      __typename
    }
  }
`

export const DELETE_PHOTO_MUTATION = gql`
  mutation DeletePhoto($where: PhotoWhereUniqueInput!) {
    deletePhoto(where: $where) {
      id
    }
  }
`
