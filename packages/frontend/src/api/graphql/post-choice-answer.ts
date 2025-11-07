import gql from 'graphql-tag'

export const GET_POST_CHOICE_ANSWER_QUERY = gql`
  query GetPostChoiceAnswers($where: PostChoiceAnswerWhereInput!) {
    postChoiceAnswers(where: $where) {
      id
      question {
        id
      }
      member {
        id
      }
      choiceIndex
      correct
    }
  }
`

export const CREATE_POST_CHOICE_ANSWER_MUTATION = gql`
  mutation CreatePostChoiceAnswer($data: PostChoiceAnswerCreateInput!) {
    createPostChoiceAnswer(data: $data) {
      question {
        id
      }
      choiceIndex
      correct
    }
  }
`

export const UPDATE_POST_CHOICE_ANSWER_MUTATION = gql`
  mutation UpdatePostChoiceAnswer(
    $id: ID!
    $data: PostChoiceAnswerUpdateInput!
  ) {
    updatePostChoiceAnswer(where: { id: $id }, data: $data) {
      id
      choiceIndex
      correct
    }
  }
`
