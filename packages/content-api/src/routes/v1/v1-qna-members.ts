import {
  V1CreatePostChoiceAnswerBodySchema,
  V1CreatePostEssayAnswerBodySchema,
  V1CreatePostEssayAnswerLikeBodySchema,
  V1MemberPostChoiceAnswersQuerySchema,
  V1MemberPostEssayAnswersQuerySchema,
  V1PatchPostChoiceAnswerBodySchema,
  V1PatchPostEssayAnswerBodySchema,
} from '@kids-reporter/api-types'
import { Prisma, prisma } from '@kids-reporter/db'
import express from 'express'
import { z } from 'zod'

import { asyncRoute } from '../../async-route.js'
import consts from '../../constants.js'
import { verifyGoApiJwt } from '../../middlewares/verify-go-api-jwt.js'
import { computeChoiceCorrect } from '../../qna-utils.js'
import { sendJsonError } from '../../send-json-error.js'

function questionIdFromBody(raw: string | number): number | null {
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

const statusCodes = consts.statusCodes

/** Q&A mutations and member-scoped lists; parity with CMS list hooks in packages/cms/lists/post-*-answer*.ts */

async function requireMember(
  req: express.Request,
  res: express.Response
): Promise<{ id: string } | null> {
  const userId = req.goApiJwtUserId
  if (!userId) {
    sendJsonError(res, statusCodes.unauthorized, 'unauthorized', 'Unauthorized')
    return null
  }
  const m = await prisma.member.findUnique({
    where: { twreporter_user_id: userId },
    select: { id: true, role: true },
  })
  if (!m) {
    sendJsonError(res, 404, 'not_found', 'Not found')
    return null
  }
  if (m.role !== 'member' && m.role !== 'admin') {
    sendJsonError(res, 403, 'forbidden', 'Forbidden')
    return null
  }
  return { id: m.id }
}

async function updatePostChoiceAnswerForMember(
  member: { id: string },
  res: express.Response,
  id: number,
  data: Record<string, unknown>
): Promise<void> {
  const existing = await prisma.postChoiceAnswer.findUnique({
    where: { id },
    select: { memberId: true, questionId: true },
  })
  if (!existing || existing.memberId !== member.id) {
    sendJsonError(res, 403, 'forbidden', 'Forbidden')
    return
  }

  let choiceIndex: number | undefined =
    typeof data.choiceIndex === 'number' ? data.choiceIndex : undefined
  if (choiceIndex === undefined && existing.questionId != null) {
    const cur = await prisma.postChoiceAnswer.findUnique({
      where: { id },
      select: { choiceIndex: true },
    })
    choiceIndex = cur?.choiceIndex
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

  res.json({
    id: String(updated.id),
    choiceIndex: updated.choiceIndex,
    correct: updated.correct,
  })
}

async function updatePostEssayAnswerForMember(
  member: { id: string },
  res: express.Response,
  id: number,
  data: Record<string, unknown>
): Promise<void> {
  const existing = await prisma.postEssayAnswer.findUnique({
    where: { id },
    select: { memberId: true },
  })
  if (!existing || existing.memberId !== member.id) {
    sendJsonError(res, 403, 'forbidden', 'Forbidden')
    return
  }

  const content = data.content
  if (typeof content !== 'string') {
    sendJsonError(res, 400, 'invalid_request', 'Invalid body', {
      reason: 'invalid_body',
    })
    return
  }

  const updated = await prisma.postEssayAnswer.update({
    where: { id },
    data: { content },
    select: { id: true, content: true },
  })

  res.json({
    id: String(updated.id),
    content: updated.content,
  })
}

async function deletePostEssayAnswerLikeForMember(
  member: { id: string },
  res: express.Response,
  likeId: number
): Promise<void> {
  const existing = await prisma.postEssayAnswerLike.findUnique({
    where: { id: likeId },
    select: { id: true, memberId: true, answerId: true },
  })
  if (!existing) {
    sendJsonError(res, 404, 'not_found', 'Not found')
    return
  }
  if (existing.memberId !== member.id) {
    sendJsonError(res, 403, 'forbidden', 'Forbidden')
    return
  }

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

  res.json({ id: String(existing.id) })
}

export function createV1QnaMembersRouter() {
  const router = express.Router()
  router.use(verifyGoApiJwt)

  router.get(
    '/me/post-choice-answers',
    asyncRoute(async (req, res) => {
      const member = await requireMember(req, res)
      if (!member) return

      const q = V1MemberPostChoiceAnswersQuerySchema.parse(req.query)
      const rows = await prisma.postChoiceAnswer.findMany({
        where: {
          memberId: member.id,
          ...(q.postSlug ? { question: { post: { slug: q.postSlug } } } : {}),
        },
        select: {
          id: true,
          choiceIndex: true,
          correct: true,
          question: { select: { id: true } },
        },
      })
      res.json(
        rows.map((r) => ({
          id: String(r.id),
          choiceIndex: r.choiceIndex,
          correct: r.correct,
          question: r.question ? { id: String(r.question.id) } : undefined,
        }))
      )
    })
  )

  router.get(
    '/me/post-essay-answers',
    asyncRoute(async (req, res) => {
      const member = await requireMember(req, res)
      if (!member) return

      const q = V1MemberPostEssayAnswersQuerySchema.parse(req.query)
      const rows = await prisma.postEssayAnswer.findMany({
        where: {
          memberId: member.id,
          ...(q.postSlug ? { question: { post: { slug: q.postSlug } } } : {}),
        },
        select: {
          id: true,
          content: true,
          question: { select: { id: true } },
        },
      })
      res.json(
        rows.map((r) => ({
          id: String(r.id),
          content: r.content,
          question: r.question ? { id: String(r.question.id) } : undefined,
        }))
      )
    })
  )

  router.post(
    '/me/post-choice-answers',
    asyncRoute(async (req, res) => {
      const member = await requireMember(req, res)
      if (!member) return

      const parsed = V1CreatePostChoiceAnswerBodySchema.safeParse(
        req.body ?? {}
      )
      if (!parsed.success) throw new z.ZodError(parsed.error.issues)

      const questionId = questionIdFromBody(parsed.data.questionId)
      const choiceIndex = parsed.data.choiceIndex
      if (questionId == null || typeof choiceIndex !== 'number') {
        sendJsonError(res, 400, 'invalid_request', 'Invalid body', {
          reason: 'invalid_body',
        })
        return
      }

      const correct = await computeChoiceCorrect(
        prisma,
        questionId,
        choiceIndex
      )
      const compositeKey = `${questionId}:${member.id}`

      const created = await prisma.postChoiceAnswer.create({
        data: {
          questionId,
          memberId: member.id,
          choiceIndex,
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

      res.json({
        id: String(created.id),
        choiceIndex: created.choiceIndex,
        correct: created.correct,
        question: created.question
          ? { id: String(created.question.id) }
          : undefined,
      })
    })
  )

  router.patch(
    '/me/post-choice-answers/:id',
    asyncRoute(async (req, res) => {
      const member = await requireMember(req, res)
      if (!member) return

      const id = Number(req.params.id)
      if (!Number.isFinite(id)) {
        sendJsonError(res, 400, 'invalid_request', 'Invalid id', {
          reason: 'invalid_id',
        })
        return
      }

      const parsed = V1PatchPostChoiceAnswerBodySchema.safeParse(req.body ?? {})
      if (!parsed.success) throw new z.ZodError(parsed.error.issues)

      await updatePostChoiceAnswerForMember(
        member,
        res,
        id,
        parsed.data as Record<string, unknown>
      )
    })
  )

  router.post(
    '/me/post-essay-answers',
    asyncRoute(async (req, res) => {
      const member = await requireMember(req, res)
      if (!member) return

      const parsed = V1CreatePostEssayAnswerBodySchema.safeParse(req.body ?? {})
      if (!parsed.success) throw new z.ZodError(parsed.error.issues)

      const questionId = questionIdFromBody(parsed.data.questionId)
      const content = parsed.data.content
      if (questionId == null || typeof content !== 'string') {
        sendJsonError(res, 400, 'invalid_request', 'Invalid body', {
          reason: 'invalid_body',
        })
        return
      }

      const compositeKey = `${questionId}:${member.id}`
      const created = await prisma.postEssayAnswer.create({
        data: {
          questionId,
          memberId: member.id,
          content,
          compositeKey,
        },
        select: {
          id: true,
          content: true,
          question: { select: { id: true } },
        },
      })

      res.json({
        id: String(created.id),
        content: created.content,
        question: created.question
          ? { id: String(created.question.id) }
          : undefined,
      })
    })
  )

  router.patch(
    '/me/post-essay-answers/:id',
    asyncRoute(async (req, res) => {
      const member = await requireMember(req, res)
      if (!member) return

      const id = Number(req.params.id)
      if (!Number.isFinite(id)) {
        sendJsonError(res, 400, 'invalid_request', 'Invalid id', {
          reason: 'invalid_id',
        })
        return
      }

      const parsed = V1PatchPostEssayAnswerBodySchema.safeParse(req.body ?? {})
      if (!parsed.success) throw new z.ZodError(parsed.error.issues)

      await updatePostEssayAnswerForMember(
        member,
        res,
        id,
        parsed.data as Record<string, unknown>
      )
    })
  )

  router.post(
    '/me/post-essay-answer-likes',
    asyncRoute(async (req, res) => {
      const member = await requireMember(req, res)
      if (!member) return

      const parsed = V1CreatePostEssayAnswerLikeBodySchema.safeParse(
        req.body ?? {}
      )
      if (!parsed.success) throw new z.ZodError(parsed.error.issues)

      const answerId = questionIdFromBody(parsed.data.answerId)
      if (answerId == null) {
        sendJsonError(res, 400, 'invalid_request', 'Invalid body', {
          reason: 'invalid_body',
        })
        return
      }

      const compositeKey = `${answerId}:${member.id}`

      try {
        const like = await prisma.$transaction(async (tx) => {
          const row = await tx.postEssayAnswerLike.create({
            data: {
              answerId,
              memberId: member.id,
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

        res.json({
          id: String(like.id),
          answer: { id: String(like.answerId) },
          member: { id: like.memberId },
        })
      } catch (e) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === 'P2002'
        ) {
          sendJsonError(res, 409, 'conflict', 'Conflict', {
            reason: 'duplicate_like',
          })
          return
        }
        throw e
      }
    })
  )

  router.delete(
    '/me/post-essay-answer-likes/:id',
    asyncRoute(async (req, res) => {
      const member = await requireMember(req, res)
      if (!member) return

      const likeId = Number(req.params.id)
      if (!Number.isFinite(likeId)) {
        sendJsonError(res, 400, 'invalid_request', 'Invalid id', {
          reason: 'invalid_id',
        })
        return
      }

      await deletePostEssayAnswerLikeForMember(member, res, likeId)
    })
  )

  return router
}
