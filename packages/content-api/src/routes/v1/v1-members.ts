import { randomUUID } from 'node:crypto'
import { mkdir, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'

import {
  essayAnswerIdsFromCommaSeparatedParam,
  essayAnswerIdsQueryToString,
  V1EssayAnswersHasLikedQuerySchema,
  V1MemberPostsWithAnswersQuerySchema,
  V1MemberProfilePatchBodySchema,
  V1MemberProfileSchema,
} from '@kids-reporter/api-types'
import { Prisma, prisma } from '@kids-reporter/db'
import express from 'express'
import multer from 'multer'
import { z } from 'zod'

import { asyncRoute } from '../../async-route.js'
import consts from '../../constants.js'
import envVar from '../../environment-variables.js'
import { verifyGoApiJwt } from '../../middlewares/verify-go-api-jwt.js'
import { sendJsonError } from '../../send-json-error.js'

const statusCodes = consts.statusCodes

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
})

const MEMBER_AVATAR_MIMES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
])

const extForMime = (m: string) => {
  if (m === 'image/jpeg' || m === 'image/jpg') return 'jpg'
  if (m === 'image/png') return 'png'
  if (m === 'image/gif') return 'gif'
  if (m === 'image/webp') return 'webp'
  return 'bin'
}

const memberSelect = {
  id: true,
  name: true,
  email: true,
  nickname: true,
  contactEmail: true,
  twreporter_user_id: true,
  showBaodaozai: true,
  essayQuestionCount: true,
  createdAt: true,
  avatar: {
    select: {
      id: true,
      imageFile_id: true,
      imageFile_extension: true,
    },
  },
} as const

type MemberRow = {
  id: string
  name: string
  email: string
  nickname: string
  contactEmail: string
  twreporter_user_id: string
  showBaodaozai: boolean
  essayQuestionCount: number | null
  createdAt: Date | null
  avatar: {
    id: number
    imageFile_id: string | null
    imageFile_extension: string | null
  } | null
}

const buildMemberAvatarFileUrl = (avatar: {
  imageFile_id: string | null
  imageFile_extension: string | null
}) => {
  const filename = avatar.imageFile_id
  if (!filename) return ''
  const ext = avatar.imageFile_extension ? `.${avatar.imageFile_extension}` : ''
  return `${envVar.gcs.origin}/images/${filename}${ext}`
}

const mapMember = (m: MemberRow): z.infer<typeof V1MemberProfileSchema> => ({
  id: m.id,
  name: m.name,
  email: m.email,
  nickname: m.nickname,
  contactEmail: m.contactEmail,
  twreporter_user_id: m.twreporter_user_id,
  showBaodaozai: m.showBaodaozai,
  essayQuestionCount: m.essayQuestionCount,
  createdAt: m.createdAt ? m.createdAt.toISOString() : null,
  avatar: m.avatar
    ? {
        id: String(m.avatar.id),
        fileUrl: buildMemberAvatarFileUrl(m.avatar),
      }
    : null,
})

export function createV1MembersRouter() {
  const router = express.Router()
  router.use(verifyGoApiJwt)

  router.get(
    '/me',
    asyncRoute(async (req, res) => {
      const userId = req.goApiJwtUserId
      if (!userId) {
        sendJsonError(
          res,
          statusCodes.unauthorized,
          'unauthorized',
          'Unauthorized'
        )
        return
      }

      const member = await prisma.member.findUnique({
        where: { twreporter_user_id: userId },
        select: memberSelect,
      })

      if (!member) {
        sendJsonError(res, 404, 'not_found', 'Not found')
        return
      }

      res.json(mapMember(member as MemberRow))
    })
  )

  router.patch(
    '/me',
    asyncRoute(async (req, res) => {
      const userId = req.goApiJwtUserId
      if (!userId) {
        sendJsonError(
          res,
          statusCodes.unauthorized,
          'unauthorized',
          'Unauthorized'
        )
        return
      }

      const parsedBody = V1MemberProfilePatchBodySchema.safeParse(
        req.body ?? {}
      )
      if (!parsedBody.success) {
        throw new z.ZodError(parsedBody.error.issues)
      }

      if (Object.keys(parsedBody.data).length === 0) {
        sendJsonError(
          res,
          statusCodes.badRequest,
          'invalid_request',
          'Empty body'
        )
        return
      }

      const existing = await prisma.member.findUnique({
        where: { twreporter_user_id: userId },
        select: { id: true },
      })

      if (!existing) {
        sendJsonError(res, 404, 'not_found', 'Not found')
        return
      }

      const updated = await prisma.member.update({
        where: { twreporter_user_id: userId },
        data: parsedBody.data,
        select: memberSelect,
      })

      res.json(mapMember(updated as MemberRow))
    })
  )

  router.get(
    '/me/posts-with-answers',
    asyncRoute(async (req, res) => {
      const userId = req.goApiJwtUserId
      if (!userId) {
        sendJsonError(
          res,
          statusCodes.unauthorized,
          'unauthorized',
          'Unauthorized'
        )
        return
      }

      const member = await prisma.member.findUnique({
        where: { twreporter_user_id: userId },
        select: { id: true, role: true },
      })
      if (!member) {
        sendJsonError(res, 404, 'not_found', 'Not found')
        return
      }
      if (member.role !== 'member' && member.role !== 'admin') {
        sendJsonError(res, 403, 'forbidden', 'Forbidden')
        return
      }

      const parsedQ = V1MemberPostsWithAnswersQuerySchema.parse(req.query)

      const takeValue = parsedQ.take
      const memberId = member.id
      const cursor = parsedQ.cursor

      const whereClause = cursor
        ? Prisma.sql`WHERE pla.last_answered_time < ${cursor}::timestamp`
        : Prisma.empty

      const sqlQuery = Prisma.sql`
        WITH all_answer_times AS (
          SELECT 
            peq."post" as post_id,
            COALESCE(pea."updatedAt", pea."createdAt") as answer_time
          FROM "PostEssayAnswer" pea
          INNER JOIN "PostEssayQuestion" peq ON peq.id = pea."question"
          WHERE pea."member" = ${memberId}
          
          UNION ALL
          
          SELECT 
            pcq."post" as post_id,
            COALESCE(pca."updatedAt", pca."createdAt") as answer_time
          FROM "PostChoiceAnswer" pca
          INNER JOIN "PostChoiceQuestion" pcq ON pcq.id = pca."question"
          WHERE pca."member" = ${memberId}
        ),
        post_last_answered AS (
          SELECT 
            post_id,
            MAX(answer_time) as last_answered_time
          FROM all_answer_times
          GROUP BY post_id
        )
        SELECT 
          p.id,
          p.title,
          p.slug,
          p."publishedDate" as published_date,
          pla.last_answered_time
        FROM "Post" p
        INNER JOIN post_last_answered pla ON pla.post_id = p.id
        ${whereClause}
        ORDER BY pla.last_answered_time DESC
        LIMIT ${takeValue + 1}
      `

      const postsRaw = await prisma.$queryRaw<
        Array<{
          id: number
          title: string
          slug: string
          published_date: Date | null
          last_answered_time: Date
        }>
      >(sqlQuery)

      if (postsRaw.length === 0) {
        res.json({ posts: [], nextCursor: null })
        return
      }

      const hasNextPage = postsRaw.length > takeValue
      const postsToReturn = postsRaw.slice(0, takeValue)
      const postIds = postsToReturn.map((p) => p.id)

      const [essayAnswersData, choiceAnswersData] = await Promise.all([
        prisma.postEssayAnswer.findMany({
          where: {
            memberId,
            question: { postId: { in: postIds } },
          },
          select: {
            id: true,
            content: true,
            likesCount: true,
            createdAt: true,
            updatedAt: true,
            question: {
              select: {
                id: true,
                title: true,
                hint: true,
                post: { select: { id: true } },
              },
            },
          },
        }),
        prisma.postChoiceAnswer.findMany({
          where: {
            memberId,
            question: { postId: { in: postIds } },
          },
          select: {
            id: true,
            choiceIndex: true,
            correct: true,
            createdAt: true,
            updatedAt: true,
            question: {
              select: {
                id: true,
                title: true,
                options: true,
                reason: true,
                post: { select: { id: true } },
              },
            },
          },
        }),
      ])

      const mapChoiceOpts = (raw: unknown) => {
        if (!Array.isArray(raw)) return []
        return raw.map(
          (o: { content?: unknown; isCorrectAnswer?: unknown }) => ({
            content:
              typeof o?.content === 'string'
                ? o.content
                : String(o?.content ?? ''),
            isCorrectAnswer: !!o?.isCorrectAnswer,
          })
        )
      }

      const posts = postsToReturn.map((post) => {
        const postIdStr = post.id.toString()
        const essayAnswers = essayAnswersData
          .filter((a) => a.question?.post?.id?.toString() === postIdStr)
          .map((a) => ({
            id: String(a.id),
            content: a.content,
            likesCount: a.likesCount,
            createdAt: a.createdAt?.toISOString() ?? '',
            updatedAt: a.updatedAt?.toISOString() ?? '',
            question: {
              id: String(a.question!.id),
              title: a.question!.title,
              hint: a.question!.hint,
              post: { id: String(a.question!.post!.id) },
            },
          }))
        const choiceAnswers = choiceAnswersData
          .filter((a) => a.question?.post?.id?.toString() === postIdStr)
          .map((a) => ({
            id: String(a.id),
            choiceIndex: a.choiceIndex,
            correct: a.correct,
            createdAt: a.createdAt?.toISOString() ?? '',
            updatedAt: a.updatedAt?.toISOString() ?? '',
            question: {
              id: String(a.question!.id),
              title: a.question!.title,
              options: mapChoiceOpts(a.question!.options),
              reason: a.question!.reason,
              post: { id: String(a.question!.post!.id) },
            },
          }))
        return {
          id: String(post.id),
          title: post.title,
          slug: post.slug,
          publishedDate: post.published_date
            ? post.published_date.toISOString()
            : '',
          essayAnswers,
          choiceAnswers,
          lastAnsweredTime: post.last_answered_time.toISOString(),
        }
      })

      const nextCursor = hasNextPage
        ? (posts[posts.length - 1]?.lastAnsweredTime ?? null)
        : null

      res.json({ posts, nextCursor })
    })
  )

  router.get(
    '/me/essay-answers/has-liked',
    asyncRoute(async (req, res) => {
      const userId = req.goApiJwtUserId
      if (!userId) {
        sendJsonError(
          res,
          statusCodes.unauthorized,
          'unauthorized',
          'Unauthorized'
        )
        return
      }

      const member = await prisma.member.findUnique({
        where: { twreporter_user_id: userId },
        select: { id: true, role: true },
      })
      if (!member) {
        sendJsonError(res, 404, 'not_found', 'Not found')
        return
      }
      if (member.role !== 'member' && member.role !== 'admin') {
        sendJsonError(res, 403, 'forbidden', 'Forbidden')
        return
      }

      const queryStr = essayAnswerIdsQueryToString(
        req.query.essayAnswerIds as string | string[] | undefined
      )
      const parsedQ = V1EssayAnswersHasLikedQuerySchema.safeParse({
        essayAnswerIds: queryStr,
      })
      if (!parsedQ.success) {
        sendJsonError(
          res,
          statusCodes.badRequest,
          'invalid_request',
          'Invalid request'
        )
        return
      }

      const essayAnswerIds = essayAnswerIdsFromCommaSeparatedParam(
        parsedQ.data.essayAnswerIds
      )

      if (!essayAnswerIds.length) {
        res.json([])
        return
      }

      const ids = essayAnswerIds
        .map((id: string) => Number.parseInt(id, 10))
        .filter((n: number) => Number.isFinite(n))

      const likes = await prisma.postEssayAnswerLike.findMany({
        where: {
          memberId: member.id,
          answerId: { in: ids },
        },
        select: {
          id: true,
          answerId: true,
        },
      })

      const result = essayAnswerIds.map((idStr: string) => {
        const idNum = Number.parseInt(idStr, 10)
        const hit = likes.find((l) => l.answerId === idNum)
        return {
          essayAnswerId: idStr,
          hasLiked: !!hit,
          essayAnswerLikeId: hit ? String(hit.id) : '',
        }
      })

      res.json(result)
    })
  )

  const avatarStorageDir = () =>
    path.join(envVar.images.storagePath || '', 'images')

  const tryUnlinkAvatarFile = async (avatar: {
    imageFile_id: string | null
    imageFile_extension: string | null
  }) => {
    const base = envVar.images.storagePath
    if (!base || !avatar.imageFile_id) return
    const rel = `${avatar.imageFile_id}${
      avatar.imageFile_extension ? `.${avatar.imageFile_extension}` : ''
    }`
    const full = path.join(base, 'images', rel)
    try {
      await unlink(full)
    } catch {
      /* ignore missing file */
    }
  }

  router.post(
    '/me/avatar',
    upload.single('file'),
    asyncRoute(async (req, res) => {
      const userId = req.goApiJwtUserId
      if (!userId) {
        sendJsonError(
          res,
          statusCodes.unauthorized,
          'unauthorized',
          'Unauthorized'
        )
        return
      }

      if (!envVar.images.storagePath) {
        sendJsonError(
          res,
          statusCodes.internalServerError,
          'internal_server_error',
          'Images storage is not configured',
          { reason: 'images_storage_not_configured' }
        )
        return
      }

      const file = req.file
      if (!file?.buffer || !file.mimetype) {
        sendJsonError(
          res,
          statusCodes.badRequest,
          'invalid_request',
          'Missing file',
          {
            reason: 'missing_file',
          }
        )
        return
      }

      if (!MEMBER_AVATAR_MIMES.has(file.mimetype)) {
        sendJsonError(
          res,
          statusCodes.badRequest,
          'invalid_request',
          'Invalid file type',
          { reason: 'invalid_file_type' }
        )
        return
      }

      const member = await prisma.member.findUnique({
        where: { twreporter_user_id: userId },
        select: {
          id: true,
          role: true,
          avatarId: true,
        },
      })
      if (!member) {
        sendJsonError(res, 404, 'not_found', 'Not found')
        return
      }
      if (member.role !== 'member' && member.role !== 'admin') {
        sendJsonError(res, 403, 'forbidden', 'Forbidden')
        return
      }

      const ext = extForMime(file.mimetype)
      const imageFile_id = randomUUID().replace(/-/g, '')
      const dir = avatarStorageDir()
      await mkdir(dir, { recursive: true })
      const diskName = `${imageFile_id}.${ext}`
      await writeFile(path.join(dir, diskName), file.buffer)

      const uploadName =
        typeof req.body?.name === 'string' && req.body.name
          ? req.body.name
          : 'memberAvatar'

      const created = await prisma.$transaction(async (tx) => {
        if (member.avatarId) {
          const old = await tx.memberAvatar.findUnique({
            where: { id: member.avatarId },
          })
          if (old) {
            await tryUnlinkAvatarFile(old)
            await tx.memberAvatar.delete({ where: { id: old.id } })
          }
          await tx.member.update({
            where: { id: member.id },
            data: { avatarId: null },
          })
        }
        const row = await tx.memberAvatar.create({
          data: {
            name: uploadName,
            imageFile_id,
            imageFile_extension: ext,
            imageFile_filesize: file.size,
          },
        })
        await tx.member.update({
          where: { id: member.id },
          data: { avatarId: row.id },
        })
        return row
      })

      res.json({ id: String(created.id), name: created.name })
    })
  )

  router.delete(
    '/me/avatar',
    asyncRoute(async (req, res) => {
      const userId = req.goApiJwtUserId
      if (!userId) {
        sendJsonError(
          res,
          statusCodes.unauthorized,
          'unauthorized',
          'Unauthorized'
        )
        return
      }

      const member = await prisma.member.findUnique({
        where: { twreporter_user_id: userId },
        select: { id: true, avatarId: true },
      })
      if (!member?.avatarId) {
        sendJsonError(res, 404, 'not_found', 'Not found')
        return
      }

      const old = await prisma.memberAvatar.findUnique({
        where: { id: member.avatarId },
      })
      if (!old) {
        sendJsonError(res, 404, 'not_found', 'Not found')
        return
      }

      await tryUnlinkAvatarFile(old)
      await prisma.$transaction([
        prisma.member.update({
          where: { id: member.id },
          data: { avatarId: null },
        }),
        prisma.memberAvatar.delete({ where: { id: old.id } }),
      ])

      res.json({ id: String(old.id) })
    })
  )

  return router
}
