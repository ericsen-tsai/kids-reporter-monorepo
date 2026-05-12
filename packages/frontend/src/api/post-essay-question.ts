import type { EssayAnswerOrderByFlatSchema } from '@kids-reporter/api-types'
import type { z } from 'zod'

import { getPostEssayQuestionEssayAnswersContentApi } from '@/api/content-api/post-qna'

export const getPostEssayQuestionEssayAnswers = async ({
  questionId,
  answerOrderBy,
  answerTake,
  answerSkip,
  traceHeaders,
}: {
  questionId: number
  answerOrderBy: z.infer<typeof EssayAnswerOrderByFlatSchema>
  answerTake: number
  answerSkip: number
  traceHeaders?: Record<string, string>
}) => {
  return await getPostEssayQuestionEssayAnswersContentApi({
    questionId,
    answerOrderBy,
    answerTake,
    answerSkip,
    traceHeaders,
  })
}
