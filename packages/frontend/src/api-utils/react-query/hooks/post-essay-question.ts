import { PostEssayAnswerOrderByInput } from '__generated__/types'
import { useInfiniteQuery } from '@tanstack/react-query'

import { getPostEssayQuestionEssayAnswers } from '@/api/post-essay-question'

export const POST_ESSAY_QUESTION_ESSAY_ANSWERS_INFINITY_QUERY_KEY =
  'post-essay-questions'

export function usePostEssayQuestionEssayAnswersInfinityQuery({
  questionId,
  answerOrderBy,
  answerTake,
}: {
  questionId: string
  answerOrderBy: PostEssayAnswerOrderByInput[]
  answerTake: number
}) {
  return useInfiniteQuery({
    queryKey: [
      POST_ESSAY_QUESTION_ESSAY_ANSWERS_INFINITY_QUERY_KEY,
      questionId,
      answerOrderBy,
      answerTake,
    ],
    queryFn: ({ pageParam }) =>
      getPostEssayQuestionEssayAnswers({
        where: { id: questionId },
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
