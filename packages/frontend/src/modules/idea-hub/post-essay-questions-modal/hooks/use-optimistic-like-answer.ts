import { PostEssayAnswerOrderByInput } from '__generated__/types'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import {
  MEMBER_ESSAY_ANSWERS_HAS_LIKED_QUERY_KEY,
  useGetMemberEssayAnswersHasLikedQuery,
} from '@/api-utils/react-query/hooks/extended'
import {
  useCreatePostEssayAnswerLikeMutation,
  useDeletePostEssayAnswerLikeMutation,
} from '@/api-utils/react-query/hooks/post-essay-answer-like'
import {
  POST_ESSAY_QUESTION_ESSAY_ANSWERS_INFINITY_QUERY_KEY,
  usePostEssayQuestionEssayAnswersInfinityQuery,
} from '@/api-utils/react-query/hooks/post-essay-question'

function useOptimisticLikeAnswer({
  answerId,
  memberId,
  accessToken,
  questionId,
  answerOrderBy,
  answerTake,
  answerIds,
}: {
  answerId: string
  memberId: string
  accessToken: string
  questionId: string
  answerOrderBy: PostEssayAnswerOrderByInput[]
  answerTake: number
  answerIds: string[]
}) {
  const queryClient = useQueryClient()

  const createMutation = useCreatePostEssayAnswerLikeMutation({ accessToken })
  const deleteMutation = useDeletePostEssayAnswerLikeMutation({ accessToken })

  const toggleLike = useCallback(
    async (hasLiked: boolean) => {
      const answersQueryKey = [
        POST_ESSAY_QUESTION_ESSAY_ANSWERS_INFINITY_QUERY_KEY,
        questionId,
        answerOrderBy,
        answerTake,
      ]

      const hasLikedQueryKey = [
        MEMBER_ESSAY_ANSWERS_HAS_LIKED_QUERY_KEY,
        memberId,
        answerIds,
      ]

      // Optimistically update answers query
      await queryClient.cancelQueries({ queryKey: answersQueryKey })
      const previousAnswersData = queryClient.getQueryData(answersQueryKey)

      // Optimistically update hasLiked query
      await queryClient.cancelQueries({ queryKey: hasLikedQueryKey })
      const previousHasLikedData = queryClient.getQueryData(hasLikedQueryKey)

      // Optimistically update answers: increment/decrement likesCount
      queryClient.setQueryData(
        answersQueryKey,
        (
          old: ReturnType<
            typeof usePostEssayQuestionEssayAnswersInfinityQuery
          >['data']
        ) => {
          if (!old?.pages) return old

          return {
            ...old,
            pages: old.pages.map((page) =>
              page.map((answer) => {
                if (answer.id.toString() === answerId) {
                  return {
                    ...answer,
                    likesCount: hasLiked
                      ? Math.max(0, (answer.likesCount ?? 0) - 1)
                      : (answer.likesCount ?? 0) + 1,
                  }
                }
                return answer
              })
            ),
          }
        }
      )

      // Optimistically update hasLiked query
      queryClient.setQueryData(
        hasLikedQueryKey,
        (
          old: ReturnType<typeof useGetMemberEssayAnswersHasLikedQuery>['data']
        ) => {
          if (!Array.isArray(old)) return old

          const existingIndex = old.findIndex(
            (item) => item.answerId === answerId
          )

          if (existingIndex >= 0) {
            // Update existing entry
            return old.map((item) => {
              if (item.answerId === answerId) {
                return {
                  ...item,
                  hasLiked: !hasLiked,
                }
              }
              return item
            })
          } else {
            // Add new entry if it doesn't exist
            return [
              ...old,
              {
                answerId,
                hasLiked: !hasLiked,
              },
            ]
          }
        }
      )

      try {
        if (hasLiked) {
          // Delete like
          await deleteMutation.mutateAsync({
            where: {
              compositeKey: `${answerId}:${memberId}`,
            },
          })
        } else {
          // Create like
          await createMutation.mutateAsync({
            data: {
              answer: {
                connect: {
                  id: answerId,
                },
              },
            },
          })
        }
      } catch (error) {
        // Rollback on error
        if (previousAnswersData) {
          queryClient.setQueryData(answersQueryKey, previousAnswersData)
        }
        if (previousHasLikedData) {
          queryClient.setQueryData(hasLikedQueryKey, previousHasLikedData)
        }
        throw error
      } finally {
        // Invalidate to refetch fresh data
        queryClient.invalidateQueries({ queryKey: answersQueryKey })
        queryClient.invalidateQueries({ queryKey: hasLikedQueryKey })
      }
    },
    [
      questionId,
      answerOrderBy,
      answerTake,
      memberId,
      answerIds,
      queryClient,
      answerId,
      deleteMutation,
      createMutation,
    ]
  )

  return {
    toggleLike,
    isPending: createMutation.isPending || deleteMutation.isPending,
  }
}

export default useOptimisticLikeAnswer
