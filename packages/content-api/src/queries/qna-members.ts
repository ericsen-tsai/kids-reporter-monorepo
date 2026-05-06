import { Prisma, prisma } from '@kids-reporter/db'

import { computeChoiceCorrect } from '../qna-utils.js'

export type MutationResult<T> =
  | { kind: 'ok'; data: T }
  | { kind: 'not_found' }
  | { kind: 'forbidden' }
  | { kind: 'duplicate' }

const questionRefDto = (id: number | undefined | null) =>
  id != null ? { id: String(id) } : undefined

// --- Lists ---

/** `GET /v1/members/me/post-choice-answers` */
export async function listMemberPostChoiceAnswers(
  memberId: string,
  postSlug: string | undefined
) {
  const rows = await prisma.postChoiceAnswer.findMany({
    where: {
      memberId,
      ...(postSlug ? { question: { post: { slug: postSlug } } } : {}),
    },
    select: {
      id: true,
      choiceIndex: true,
      correct: true,
      question: { select: { id: true } },
    },
  })
  return rows.map((r) => ({
    id: String(r.id),
    choiceIndex: r.choiceIndex,
    correct: r.correct,
    question: questionRefDto(r.question?.id),
  }))
}

/** `GET /v1/members/me/post-essay-answers` */
export async function listMemberPostEssayAnswers(
  memberId: string,
  postSlug: string | undefined
) {
  const rows = await prisma.postEssayAnswer.findMany({
    where: {
      memberId,
      ...(postSlug ? { question: { post: { slug: postSlug } } } : {}),
    },
    select: {
      id: true,
      content: true,
      question: { select: { id: true } },
    },
  })
  return rows.map((r) => ({
    id: String(r.id),
    content: r.content,
    question: questionRefDto(r.question?.id),
  }))
}

// --- Choice answer create/update ---

export type CreateChoiceAnswerDto = {
  id: string
  choiceIndex: number
  correct: boolean
  question: { id: string } | undefined
}

/** `POST /v1/members/me/post-choice-answers` */
export async function createMemberPostChoiceAnswer(
  memberId: string,
  input: { questionId: number; choiceIndex: number }
): Promise<CreateChoiceAnswerDto> {
  const correct = await computeChoiceCorrect(
    prisma,
    input.questionId,
    input.choiceIndex
  )
  const compositeKey = `${input.questionId}:${memberId}`

  const created = await prisma.postChoiceAnswer.create({
    data: {
      questionId: input.questionId,
      memberId,
      choiceIndex: input.choiceIndex,
      correct,
      compositeKey,
    },
    select: {
      id: true,
      choiceIndex: true,
      correct: true,
      question: { select: { id: true } },
    },
  })
  return {
    id: String(created.id),
    choiceIndex: created.choiceIndex,
    correct: created.correct,
    question: questionRefDto(created.question?.id),
  }
}

export type UpdateChoiceAnswerDto = {
  id: string
  choiceIndex: number
  correct: boolean
}

/** `PATCH /v1/members/me/post-choice-answers/:id` (missing OR wrong-owner → forbidden). */
export async function updateMemberPostChoiceAnswer(
  memberId: string,
  id: number,
  data: { choiceIndex?: number }
): Promise<MutationResult<UpdateChoiceAnswerDto>> {
  const existing = await prisma.postChoiceAnswer.findUnique({
    where: { id },
    select: { memberId: true, questionId: true, choiceIndex: true },
  })
  if (!existing || existing.memberId !== memberId) {
    return { kind: 'forbidden' }
  }

  let choiceIndex: number | undefined =
    typeof data.choiceIndex === 'number' ? data.choiceIndex : undefined
  if (choiceIndex === undefined && existing.questionId != null) {
    choiceIndex = existing.choiceIndex
  }

  let correct: boolean | undefined
  if (choiceIndex !== undefined && existing.questionId != null) {
    correct = await computeChoiceCorrect(
      prisma,
      existing.questionId,
      choiceIndex
    )
  }

  const updated = await prisma.postChoiceAnswer.update({
    where: { id },
    data: {
      ...(choiceIndex !== undefined ? { choiceIndex } : {}),
      ...(correct !== undefined ? { correct } : {}),
    },
    select: {
      id: true,
      choiceIndex: true,
      correct: true,
    },
  })

  return {
    kind: 'ok',
    data: {
      id: String(updated.id),
      choiceIndex: updated.choiceIndex,
      correct: updated.correct,
    },
  }
}

// --- Essay answer create/update ---

export type CreateEssayAnswerDto = {
  id: string
  content: string
  question: { id: string } | undefined
}

/** `POST /v1/members/me/post-essay-answers` */
export async function createMemberPostEssayAnswer(
  memberId: string,
  input: { questionId: number; content: string }
): Promise<CreateEssayAnswerDto> {
  const compositeKey = `${input.questionId}:${memberId}`
  const created = await prisma.postEssayAnswer.create({
    data: {
      questionId: input.questionId,
      memberId,
      content: input.content,
      compositeKey,
    },
    select: {
      id: true,
      content: true,
      question: { select: { id: true } },
    },
  })
  return {
    id: String(created.id),
    content: created.content,
    question: questionRefDto(created.question?.id),
  }
}

export type UpdateEssayAnswerDto = {
  id: string
  content: string
}

/** `PATCH /v1/members/me/post-essay-answers/:id` (missing OR wrong-owner → forbidden). */
export async function updateMemberPostEssayAnswer(
  memberId: string,
  id: number,
  content: string
): Promise<MutationResult<UpdateEssayAnswerDto>> {
  const existing = await prisma.postEssayAnswer.findUnique({
    where: { id },
    select: { memberId: true },
  })
  if (!existing || existing.memberId !== memberId) {
    return { kind: 'forbidden' }
  }

  const updated = await prisma.postEssayAnswer.update({
    where: { id },
    data: { content },
    select: { id: true, content: true },
  })

  return {
    kind: 'ok',
    data: { id: String(updated.id), content: updated.content },
  }
}

// --- Essay answer likes ---

export type CreateEssayAnswerLikeDto = {
  id: string
  answer: { id: string }
  member: { id: string }
}

/** `POST /v1/members/me/post-essay-answer-likes` (P2002 → duplicate → 409). */
export async function createMemberEssayAnswerLike(
  memberId: string,
  answerId: number
): Promise<MutationResult<CreateEssayAnswerLikeDto>> {
  const compositeKey = `${answerId}:${memberId}`
  try {
    const like = await prisma.$transaction(async (tx) => {
      const row = await tx.postEssayAnswerLike.create({
        data: {
          answerId,
          memberId,
          compositeKey,
        },
        select: {
          id: true,
          answerId: true,
          memberId: true,
        },
      })
      await tx.$executeRaw`
        UPDATE "PostEssayAnswer" SET "likesCount" = "likesCount" + 1 WHERE "id" = ${answerId}
      `
      return row
    })

    return {
      kind: 'ok',
      data: {
        id: String(like.id),
        answer: { id: String(like.answerId) },
        member: { id: like.memberId ?? memberId },
      },
    }
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2002'
    ) {
      return { kind: 'duplicate' }
    }
    throw e
  }
}

/** `DELETE /v1/members/me/post-essay-answer-likes/:id` (missing → not_found, wrong-owner → forbidden). */
export async function deleteMemberEssayAnswerLike(
  memberId: string,
  likeId: number
): Promise<MutationResult<{ id: string }>> {
  const existing = await prisma.postEssayAnswerLike.findUnique({
    where: { id: likeId },
    select: { id: true, memberId: true, answerId: true },
  })
  if (!existing) return { kind: 'not_found' }
  if (existing.memberId !== memberId) return { kind: 'forbidden' }

  await prisma.$transaction(async (tx) => {
    await tx.postEssayAnswerLike.delete({
      where: { id: likeId },
    })
    if (existing.answerId != null) {
      await tx.$executeRaw`
        UPDATE "PostEssayAnswer" SET "likesCount" = "likesCount" - 1
        WHERE "id" = ${existing.answerId} AND "likesCount" > 0
      `
    }
  })

  return { kind: 'ok', data: { id: String(existing.id) } }
}
