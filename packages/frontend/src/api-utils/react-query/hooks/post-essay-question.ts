import {
  PostEssayAnswerOrderByInput,
  PostEssayQuestionOrderByInput,
  PostEssayQuestionWhereUniqueInput,
} from '__generated__/types'
import { useInfiniteQuery } from '@tanstack/react-query'

import { getPostEssayQuestionEssayAnswers } from '@/api/post-essay-question'

export const POST_ESSAY_QUESTION_ESSAY_ANSWERS_INFINITY_QUERY_KEY =
  'post-essay-questions'

export function useGetPostEssayQuestionEssayAnswersInfinityQuery({
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
}) {
  return useInfiniteQuery({
    queryKey: [
      POST_ESSAY_QUESTION_ESSAY_ANSWERS_INFINITY_QUERY_KEY,
      where,
      orderBy,
      take,
      skip,
      answerOrderBy,
      answerTake,
    ],
    queryFn: ({ pageParam }) =>
      getPostEssayQuestionEssayAnswers({
        where,
        orderBy,
        take,
        skip: pageParam,
        answerOrderBy,
        answerTake,
      }),
    getNextPageParam: (lastPage, _, lastPageParam) => {
      const hasNextPage = (lastPage?.length ?? 0) === take
      return hasNextPage ? lastPageParam + take : undefined
    },
    initialPageParam: 0,
  })
}
