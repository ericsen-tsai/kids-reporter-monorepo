import { useQueryClient } from '@tanstack/react-query'
import errors from '@twreporter/errors'
import { useCallback } from 'react'

import {
  POST_CHOICE_ANSWERS_QUERY_KEY,
  useCreatePostChoiceAnswerMutation,
  usePostChoiceAnswersQuery,
  useUpdatePostChoiceAnswerMutation,
} from '@/api-utils/react-query/hooks/post-choice-answer'
import {
  POST_ESSAY_ANSWERS_QUERY_KEY,
  useCreatePostEssayAnswerMutation,
  usePostEssayAnswersQuery,
  useUpdatePostEssayAnswerMutation,
} from '@/api-utils/react-query/hooks/post-essay-answer'
import { BaodaozaiQuestions } from '@/services/call-baodaozai'
import { log, LogLevel } from '@/utils'

function useBatchSubmitAnswers({
  memberId,
  postSlug,
  accessToken,
}: {
  memberId: string
  postSlug: string
  accessToken: string
}) {
  const queryClient = useQueryClient()

  const handleInvalidateAnswers = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [POST_ESSAY_ANSWERS_QUERY_KEY, memberId],
    })
    queryClient.invalidateQueries({
      queryKey: [POST_CHOICE_ANSWERS_QUERY_KEY, memberId],
    })
  }, [queryClient, memberId])

  const { data: essayAnswers } = usePostEssayAnswersQuery({
    memberId,
    postSlug,
    accessToken,
  })
  const { data: choiceAnswers } = usePostChoiceAnswersQuery({
    memberId,
    postSlug,
    accessToken,
  })

  const { mutateAsync: createPostEssayAnswer } =
    useCreatePostEssayAnswerMutation({
      accessToken,
    })
  const { mutateAsync: createPostChoiceAnswer } =
    useCreatePostChoiceAnswerMutation({
      accessToken,
    })

  const { mutateAsync: updatePostEssayAnswer } =
    useUpdatePostEssayAnswerMutation({
      accessToken,
    })
  const { mutateAsync: updatePostChoiceAnswer } =
    useUpdatePostChoiceAnswerMutation({
      accessToken,
    })

  const handleBatchSubmitAnswers = useCallback(
    async (
      answers: Record<number, string>,
      questions: BaodaozaiQuestions | null
    ) => {
      if (!questions) return

      const existingEssayQuestionIds =
        essayAnswers?.map((answer) => answer.question?.id ?? '') ?? []
      const existingChoiceQuestionIds =
        choiceAnswers?.map((answer) => answer.question?.id ?? '') ?? []

      await Promise.all(
        questions.map(async (question, index) => {
          if (!answers[index]) return
          try {
            if (question.type === 'essay') {
              if (existingEssayQuestionIds.includes(question.id)) {
                const answerId =
                  essayAnswers?.find(
                    (answer) => answer.question?.id === question.id
                  )?.id ?? ''
                await updatePostEssayAnswer({
                  id: answerId,
                  data: {
                    content: answers[index],
                  },
                })
                return
              }
              await createPostEssayAnswer({
                data: {
                  question: {
                    connect: {
                      id: question.id,
                    },
                  },
                  member: {
                    connect: {
                      id: memberId,
                    },
                  },
                  content: answers[index],
                },
              })
            }
            if (question.type === 'choice') {
              if (existingChoiceQuestionIds.includes(question.id)) {
                const answerId =
                  choiceAnswers?.find(
                    (answer) => answer.question?.id === question.id
                  )?.id ?? ''
                await updatePostChoiceAnswer({
                  id: answerId,
                  data: {
                    choiceIndex: parseInt(answers[index]),
                  },
                })
                return
              }
              await createPostChoiceAnswer({
                data: {
                  question: {
                    connect: {
                      id: question.id,
                    },
                  },
                  member: {
                    connect: {
                      id: memberId,
                    },
                  },
                  choiceIndex: parseInt(answers[index]),
                },
              })
            }
          } catch (_err) {
            const err = errors.helpers.wrap(
              _err,
              'BatchSubmitAnswersError',
              'Error batch submitting answers',
              question
            )

            const msg = errors.helpers.printAll(err, {
              withStack: true,
              withPayload: true,
            })

            log(LogLevel.ERROR, msg)
          }
        })
      )
      handleInvalidateAnswers()
    },
    [
      essayAnswers,
      choiceAnswers,
      createPostEssayAnswer,
      memberId,
      updatePostEssayAnswer,
      createPostChoiceAnswer,
      updatePostChoiceAnswer,
      handleInvalidateAnswers,
    ]
  )

  return { onBatchSubmitAnswers: handleBatchSubmitAnswers }
}

export default useBatchSubmitAnswers
