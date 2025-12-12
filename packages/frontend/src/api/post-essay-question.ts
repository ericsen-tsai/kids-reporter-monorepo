import { GetEssayQuestionEssayAnswersQuery } from '__generated__/operations/post-essay-question.generated'
import {
  PostEssayAnswerOrderByInput,
  PostEssayQuestionWhereUniqueInput,
} from '__generated__/types'

import { sendGQLRequest } from '@/utils/send-gql-request'

import { GET_ESSAY_QUESTION_ESSAY_ANSWERS_GQL } from './graphql/post-essay-question'

export const getPostEssayQuestionEssayAnswers = async ({
  where,
  answerOrderBy,
  answerTake,
  answerSkip,
}: {
  where: PostEssayQuestionWhereUniqueInput
  answerOrderBy: PostEssayAnswerOrderByInput[]
  answerTake: number
  answerSkip: number
}) => {
  const response = await sendGQLRequest<GetEssayQuestionEssayAnswersQuery>({
    query: GET_ESSAY_QUESTION_ESSAY_ANSWERS_GQL,
    variables: {
      where,
      answerOrderBy,
      answerTake,
      answerSkip,
    },
  })
  return response?.data?.data?.postEssayQuestion?.answers ?? []
}
