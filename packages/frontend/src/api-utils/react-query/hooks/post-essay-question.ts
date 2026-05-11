import type { EssayAnswerOrderByFlatSchema } from '@kids-reporter/api-types'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { z } from 'zod'

import { getPostEssayQuestionEssayAnswers } from '@/api/post-essay-question'

const POST_ESSAY_QUESTION_ESSAY_ANSWERS_INFINITY_QUERY_KEY =
  'post-essay-questions'

export function usePostEssayQuestionEssayAnswersInfinityQuery({
  questionId,
  answerOrderBy,
  answerTake,
}: {
  questionId: string
  answerOrderBy: z.infer<typeof EssayAnswerOrderByFlatSchema>
  answerTake: number
}) {
  const numericQuestionId = Number(questionId)
  return useInfiniteQuery({
    queryKey: usePostEssayQuestionEssayAnswersInfinityQuery.getQueryKey({
      questionId,
      answerOrderBy,
      answerTake,
    }),
    queryFn: ({ pageParam }) =>
      getPostEssayQuestionEssayAnswers({
        questionId: numericQuestionId,
        answerOrderBy,
        answerTake,
        answerSkip: pageParam,
      }),
    getNextPageParam: (lastPage, _, lastPageParam) => {
      const hasNextPage = lastPage.length === answerTake
      return hasNextPage ? lastPageParam + answerTake : undefined
    },
    initialPageParam: 0,
  })
}

usePostEssayQuestionEssayAnswersInfinityQuery.getQueryKey = ({
  questionId,
  answerOrderBy,
  answerTake,
}: {
  questionId: string
  answerOrderBy: z.infer<typeof EssayAnswerOrderByFlatSchema>
  answerTake: number
}) => [
  POST_ESSAY_QUESTION_ESSAY_ANSWERS_INFINITY_QUERY_KEY,
  questionId,
  answerOrderBy,
  answerTake,
]
