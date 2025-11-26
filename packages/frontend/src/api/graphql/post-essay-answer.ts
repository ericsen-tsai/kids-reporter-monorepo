import gql from 'graphql-tag'

export const GET_POST_ESSAY_ANSWER_QUERY = gql`
  query GetPostEssayAnswers($where: PostEssayAnswerWhereInput!) {
    postEssayAnswers(where: $where) {
      id
      question {
        id
      }
      member {
        id
      }
      content
    }
  }
`

export const GET_ALL_POST_ESSAY_ANSWERS_QUERY = gql`
  query GetAllPostEssayAnswers(
    $orderBy: [PostEssayAnswerOrderByInput!]
    $take: Int
  ) {
    postEssayAnswers(orderBy: $orderBy, take: $take) {
      id
      question {
        id
      }
      member {
        id
        avatar {
          fileUrl
        }
        nickname
        name
      }
      content
      likesCount
    }
  }
`

export const CREATE_POST_ESSAY_ANSWER_MUTATION = gql`
  mutation CreatePostEssayAnswer($data: PostEssayAnswerCreateInput!) {
    createPostEssayAnswer(data: $data) {
      question {
        id
      }
      content
    }
  }
`

export const UPDATE_POST_ESSAY_ANSWER_MUTATION = gql`
  mutation UpdatePostEssayAnswer($id: ID!, $data: PostEssayAnswerUpdateInput!) {
    updatePostEssayAnswer(where: { id: $id }, data: $data) {
      id
      content
    }
  }
`
