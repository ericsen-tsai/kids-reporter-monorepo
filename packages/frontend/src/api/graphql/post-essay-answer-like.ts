import gql from 'graphql-tag'

export const CREATE_POST_ESSAY_ANSWER_LIKE_MUTATION = gql`
  mutation CreatePostEssayAnswerLike($data: PostEssayAnswerLikeCreateInput!) {
    createPostEssayAnswerLike(data: $data) {
      answer {
        id
      }
      member {
        id
      }
    }
  }
`

export const DELETE_POST_ESSAY_ANSWER_LIKE_MUTATION = gql`
  mutation DeletePostEssayAnswerLike(
    $where: PostEssayAnswerLikeWhereUniqueInput!
  ) {
    deletePostEssayAnswerLike(where: $where) {
      id
    }
  }
`
