import { GetEssayQuestionEssayAnswersQuery } from '__generated__/operations/post-essay-question.generated'
import {
  PostEssayAnswerOrderByInput,
  PostEssayQuestionOrderByInput,
  PostEssayQuestionWhereUniqueInput,
} from '__generated__/types'

import { sendGQLRequest } from '@/utils/send-gql-request'

import { GET_ESSAY_QUESTION_ESSAY_ANSWERS_GQL } from './graphql/post-essay-question'

export const getPostEssayQuestionEssayAnswers = async ({
  where,
  orderBy,
  take,
  skip,
  answerOrderBy,
  answerTake,
}: {
  where: PostEssayQuestionWhereUniqueInput
  orderBy: PostEssayQuestionOrderByInput[]
  take: number
  skip: number
  answerOrderBy: PostEssayAnswerOrderByInput[]
  answerTake: number
}) => {
  const response = await sendGQLRequest<GetEssayQuestionEssayAnswersQuery>({
    query: GET_ESSAY_QUESTION_ESSAY_ANSWERS_GQL,
    variables: { where, orderBy, take, skip, answerOrderBy, answerTake },
  })
  return response?.data?.data?.postEssayQuestion?.answers ?? []
}
