import gql from 'graphql-tag'

export const GET_ESSAY_QUESTION_ESSAY_ANSWERS_GQL = gql`
  query GetEssayQuestionEssayAnswers(
    $where: PostEssayQuestionWhereUniqueInput!
    $answerOrderBy: [PostEssayAnswerOrderByInput!]!
    $answerTake: Int!
    $answerSkip: Int
  ) {
    postEssayQuestion(where: $where) {
      id
      title
      hint
      answers(orderBy: $answerOrderBy, take: $answerTake, skip: $answerSkip) {
        id
        content
        member {
          id
          avatar {
            fileUrl
            id
          }
          name
          nickname
          email
        }
        likesCount
      }
    }
  }
`
