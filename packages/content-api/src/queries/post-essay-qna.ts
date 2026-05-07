import { prisma } from '@kids-reporter/db'

import { maskEmail } from '../utils/mask-email.js'
import {
  buildMemberAvatarFileUrl,
  essayAnswerOrderByFromFlat,
} from '../utils/qna-utils.js'

const memberWithAvatarSelect = {
  id: true,
  name: true,
  nickname: true,
  email: true,
  avatar: {
    select: {
      id: true,
      imageFile_id: true,
      imageFile_extension: true,
    },
  },
} as const

type MemberWithAvatarRow = {
  id: string
  name: string
  nickname: string
  email: string
  avatar: {
    id: number
    imageFile_id: string | null
    imageFile_extension: string | null
  } | null
}

const mapMemberWithAvatar = (m: MemberWithAvatarRow | null) =>
  m
    ? {
        id: m.id,
        name: m.name,
        nickname: m.nickname,
        email: maskEmail(m.email),
        avatar: m.avatar
          ? {
              id: String(m.avatar.id),
              fileUrl: buildMemberAvatarFileUrl(m.avatar),
            }
          : undefined,
      }
    : undefined

export type FetchPostEssayAnswersListOpts = {
  take: number
  orderBy: 'createdAt:desc'
}

/** `GET /v1/post-essay-answers` */
export async function fetchPostEssayAnswersList(
  opts: FetchPostEssayAnswersListOpts
) {
  const rows = await prisma.postEssayAnswer.findMany({
    take: opts.take,
    orderBy: essayAnswerOrderByFromFlat(opts.orderBy),
    select: {
      id: true,
      createdAt: true,
      content: true,
      likesCount: true,
      question: {
        select: {
          id: true,
          title: true,
          post: { select: { slug: true } },
        },
      },
      member: {
        select: memberWithAvatarSelect,
      },
    },
  })

  return rows.map((r) => ({
    id: String(r.id),
    createdAt: r.createdAt?.toISOString(),
    question: r.question
      ? {
          id: String(r.question.id),
          title: r.question.title,
          post: r.question.post ? { slug: r.question.post.slug } : undefined,
        }
      : undefined,
    member: mapMemberWithAvatar(r.member as MemberWithAvatarRow | null),
    content: r.content,
    likesCount: r.likesCount,
  }))
}

export type FetchPostEssayQuestionWithAnswersOpts = {
  answerTake: number
  answerSkip: number
  answerOrderBy: 'createdAt:desc' | 'likesCount:desc'
}

/** `GET /v1/post-essay-questions/:questionId` (404 when question missing). */
export async function fetchPostEssayQuestionWithAnswers(
  questionId: number,
  opts: FetchPostEssayQuestionWithAnswersOpts
) {
  const question = await prisma.postEssayQuestion.findUnique({
    where: { id: questionId },
    select: {
      id: true,
      title: true,
      hint: true,
      answers: {
        orderBy: essayAnswerOrderByFromFlat(opts.answerOrderBy),
        take: opts.answerTake,
        skip: opts.answerSkip,
        select: {
          id: true,
          content: true,
          likesCount: true,
          member: { select: memberWithAvatarSelect },
          createdAt: true,
        },
      },
    },
  })
  if (!question) return null

  return {
    id: String(question.id),
    title: question.title,
    hint: question.hint,
    answers: question.answers.map((a) => ({
      id: String(a.id),
      content: a.content,
      likesCount: a.likesCount,
      member: mapMemberWithAvatar(a.member as MemberWithAvatarRow | null),
      createdAt: a.createdAt?.toISOString(),
    })),
  }
}
