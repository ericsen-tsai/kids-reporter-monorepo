import type {
  CreatePostChoiceAnswerMutation,
  CreatePostChoiceAnswerMutationVariables,
  CreatePostEssayAnswerLikeMutation,
  CreatePostEssayAnswerLikeMutationVariables,
  CreatePostEssayAnswerMutation,
  CreatePostEssayAnswerMutationVariables,
  DeletePostEssayAnswerLikeMutation,
  DeletePostEssayAnswerLikeMutationVariables,
  GetAllPostEssayAnswersQuery,
  GetAllPostEssayAnswersQueryVariables,
  GetEssayQuestionEssayAnswersQuery,
  GetPostChoiceAnswersQuery,
  GetPostEssayAnswersQuery,
  UpdatePostChoiceAnswerMutation,
  UpdatePostChoiceAnswerMutationVariables,
  UpdatePostEssayAnswerMutation,
  UpdatePostEssayAnswerMutationVariables,
} from '__generated__/operations/answers.generated'
import type { PostEssayAnswerOrderByInput } from '__generated__/types'

import { sendContentApiRequest } from '@/utils/send-content-api'

function questionIdFromGqlCreateData(data: Record<string, unknown>): unknown {
  const q = data.question as { connect?: { id?: unknown } } | undefined
  return q?.connect?.id
}

function answerIdFromGqlCreateData(data: Record<string, unknown>): unknown {
  const a = data.answer as { connect?: { id?: unknown } } | undefined
  return a?.connect?.id
}

export async function getPostChoiceAnswersByMemberIdContentApi({
  accessToken,
  postSlug,
}: {
  accessToken: string
  postSlug?: string
}) {
  const body = await sendContentApiRequest<
    NonNullable<GetPostChoiceAnswersQuery['postChoiceAnswers']>
  >({
    path: '/v1/members/me/post-choice-answers',
    authToken: accessToken,
    query: { postSlug: postSlug ?? undefined },
  })
  if (!Array.isArray(body)) {
    throw new Error('content-api: expected array for post-choice-answers')
  }
  return body
}

export async function createPostChoiceAnswerContentApi(
  variables: CreatePostChoiceAnswerMutationVariables,
  accessToken: string
) {
  const data = variables.data as Record<string, unknown>
  const questionId = questionIdFromGqlCreateData(data)
  const choiceIndex = data.choiceIndex
  if (
    questionId == null ||
    (typeof questionId !== 'string' && typeof questionId !== 'number') ||
    typeof choiceIndex !== 'number'
  ) {
    throw new Error('createPostChoiceAnswerContentApi: invalid variables')
  }
  const body = await sendContentApiRequest<
    CreatePostChoiceAnswerMutation['createPostChoiceAnswer']
  >({
    path: '/v1/members/me/post-choice-answers',
    method: 'POST',
    authToken: accessToken,
    body: { questionId, choiceIndex },
  })
  return body
}

export async function updatePostChoiceAnswerContentApi(
  variables: UpdatePostChoiceAnswerMutationVariables,
  accessToken: string
) {
  const id = variables.id
  const patch = variables.data as { choiceIndex?: number }
  const body = await sendContentApiRequest<
    UpdatePostChoiceAnswerMutation['updatePostChoiceAnswer']
  >({
    path: `/v1/members/me/post-choice-answers/${encodeURIComponent(String(id))}`,
    method: 'PATCH',
    authToken: accessToken,
    body:
      typeof patch.choiceIndex === 'number'
        ? { choiceIndex: patch.choiceIndex }
        : {},
  })
  return body
}

export async function getPostEssayAnswersByMemberIdContentApi({
  accessToken,
  postSlug,
}: {
  accessToken: string
  postSlug?: string
}) {
  const body = await sendContentApiRequest<
    NonNullable<GetPostEssayAnswersQuery['postEssayAnswers']>
  >({
    path: '/v1/members/me/post-essay-answers',
    authToken: accessToken,
    query: { postSlug: postSlug ?? undefined },
  })
  if (!Array.isArray(body)) {
    throw new Error('content-api: expected array for post-essay-answers')
  }
  return body
}

export async function getAllPostEssayAnswersContentApi(
  variables: GetAllPostEssayAnswersQueryVariables
) {
  const rawOrder = variables.orderBy
  const orderBy = Array.isArray(rawOrder)
    ? rawOrder
    : rawOrder
      ? [rawOrder]
      : []
  const body = await sendContentApiRequest<
    NonNullable<GetAllPostEssayAnswersQuery['postEssayAnswers']>
  >({
    path: '/v1/post-essay-answers',
    query: {
      take: variables.take ?? undefined,
      orderBy: orderBy.length > 0 ? JSON.stringify(orderBy) : undefined,
    },
  })
  if (!Array.isArray(body)) {
    throw new Error('content-api: expected array for all post-essay-answers')
  }
  return body
}

export async function createPostEssayAnswerContentApi(
  variables: CreatePostEssayAnswerMutationVariables,
  accessToken: string
) {
  const data = variables.data as Record<string, unknown>
  const questionId = questionIdFromGqlCreateData(data)
  const content = data.content
  if (
    questionId == null ||
    (typeof questionId !== 'string' && typeof questionId !== 'number') ||
    typeof content !== 'string'
  ) {
    throw new Error('createPostEssayAnswerContentApi: invalid variables')
  }
  const body = await sendContentApiRequest<
    CreatePostEssayAnswerMutation['createPostEssayAnswer']
  >({
    path: '/v1/members/me/post-essay-answers',
    method: 'POST',
    authToken: accessToken,
    body: { questionId, content },
  })
  return body
}

export async function updatePostEssayAnswerContentApi(
  variables: UpdatePostEssayAnswerMutationVariables,
  accessToken: string
) {
  const id = variables.id
  const patch = variables.data as { content: string }
  const body = await sendContentApiRequest<
    UpdatePostEssayAnswerMutation['updatePostEssayAnswer']
  >({
    path: `/v1/members/me/post-essay-answers/${encodeURIComponent(String(id))}`,
    method: 'PATCH',
    authToken: accessToken,
    body: { content: patch.content },
  })
  return body
}

export async function getPostEssayQuestionEssayAnswersContentApi({
  where,
  answerOrderBy,
  answerTake,
  answerSkip,
}: {
  where: { id: string }
  answerOrderBy: PostEssayAnswerOrderByInput[]
  answerTake: number
  answerSkip?: number
}) {
  const questionId = Number(where.id)
  if (!Number.isFinite(questionId)) {
    throw new Error('invalid question id')
  }
  const body = await sendContentApiRequest<NonNullable<
    GetEssayQuestionEssayAnswersQuery['postEssayQuestion']
  > | null>({
    path: `/v1/post-essay-questions/${questionId}/answers`,
    query: {
      answerTake,
      answerSkip: answerSkip ?? undefined,
      answerOrderBy:
        answerOrderBy.length > 0 ? JSON.stringify(answerOrderBy) : undefined,
    },
  })
  if (body == null) {
    return []
  }
  return body.answers ?? []
}

export async function createPostEssayAnswerLikeContentApi(
  variables: CreatePostEssayAnswerLikeMutationVariables,
  accessToken: string
) {
  const data = variables.data as Record<string, unknown>
  const answerId = answerIdFromGqlCreateData(data)
  if (
    answerId == null ||
    (typeof answerId !== 'string' && typeof answerId !== 'number')
  ) {
    throw new Error('createPostEssayAnswerLikeContentApi: invalid variables')
  }
  const body = await sendContentApiRequest<
    CreatePostEssayAnswerLikeMutation['createPostEssayAnswerLike']
  >({
    path: '/v1/members/me/post-essay-answer-likes',
    method: 'POST',
    authToken: accessToken,
    body: { answerId },
  })
  return body
}

export async function deletePostEssayAnswerLikeContentApi(
  variables: DeletePostEssayAnswerLikeMutationVariables,
  accessToken: string
) {
  const likeId = variables.where?.id
  if (likeId == null || likeId === '') {
    throw new Error('deletePostEssayAnswerLikeContentApi: where.id is required')
  }
  const body = await sendContentApiRequest<
    DeletePostEssayAnswerLikeMutation['deletePostEssayAnswerLike']
  >({
    path: `/v1/members/me/post-essay-answer-likes/${encodeURIComponent(String(likeId))}`,
    method: 'DELETE',
    authToken: accessToken,
  })
  return body
}
