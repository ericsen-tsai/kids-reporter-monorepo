import { randomUUID } from 'node:crypto'
import { mkdir, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'

import {
  V1MemberProfilePatchBodySchema,
  V1MemberProfileSchema,
} from '@kids-reporter/api-types'
import { prisma } from '@kids-reporter/db'
import type { z } from 'zod'

import envVar from '../environment-variables.js'
import { buildMemberAvatarFileUrl } from '../qna-utils.js'

export type MemberProfileDto = z.infer<typeof V1MemberProfileSchema>
export type MemberProfilePatchInput = z.infer<
  typeof V1MemberProfilePatchBodySchema
>

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

const mapMember = (m: MemberRow): MemberProfileDto => ({
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

/** Used by `GET /v1/members/me`. */
export async function findMemberProfile(
  userId: string
): Promise<MemberProfileDto | null> {
  const member = await prisma.member.findUnique({
    where: { twreporter_user_id: userId },
    select: memberSelect,
  })
  return member ? mapMember(member as MemberRow) : null
}

/** Used by handlers that only need `{ id, role }` and a 404/403 short-circuit. */
export async function findMemberIdRole(
  userId: string
): Promise<{ id: string; role: string | null } | null> {
  const m = await prisma.member.findUnique({
    where: { twreporter_user_id: userId },
    select: { id: true, role: true },
  })
  return m ?? null
}

/**
 * `PATCH /v1/members/me`. Returns `null` when the member does not exist;
 * routes should map that to 404 (matching prior behavior).
 */
export async function updateMemberProfile(
  userId: string,
  data: MemberProfilePatchInput
): Promise<MemberProfileDto | null> {
  const existing = await prisma.member.findUnique({
    where: { twreporter_user_id: userId },
    select: { id: true },
  })
  if (!existing) return null

  const updated = await prisma.member.update({
    where: { twreporter_user_id: userId },
    data,
    select: memberSelect,
  })
  return mapMember(updated as MemberRow)
}

// --- Avatar (DB transaction colocated with FS unlink) ---

export const MEMBER_AVATAR_MIMES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
])

export const extForMemberAvatarMime = (m: string) => {
  if (m === 'image/jpeg' || m === 'image/jpg') return 'jpg'
  if (m === 'image/png') return 'png'
  if (m === 'image/gif') return 'gif'
  if (m === 'image/webp') return 'webp'
  return 'bin'
}

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

export type FindMemberAvatarStateResult =
  | {
      kind: 'ok'
      member: { id: string; role: string | null; avatarId: number | null }
    }
  | { kind: 'not_found' }
  | { kind: 'forbidden' }

/** Used before avatar upload; consolidates auth lookup + role check. */
export async function findMemberForAvatarUpload(
  userId: string
): Promise<FindMemberAvatarStateResult> {
  const member = await prisma.member.findUnique({
    where: { twreporter_user_id: userId },
    select: { id: true, role: true, avatarId: true },
  })
  if (!member) return { kind: 'not_found' }
  if (member.role !== 'member' && member.role !== 'admin') {
    return { kind: 'forbidden' }
  }
  return { kind: 'ok', member }
}

export type ReplaceMemberAvatarInput = {
  memberId: string
  prevAvatarId: number | null
  fileBuffer: Buffer
  fileSize: number
  mime: string
  uploadName: string
}

/**
 * Replace a member's avatar atomically. Writes the new file to disk,
 * then within a Prisma transaction: deletes the old `MemberAvatar` row
 * (and unlinks its disk file inside the transaction, matching prior semantics)
 * and creates the new row, finally pointing the member at it.
 */
export async function replaceMemberAvatar(
  input: ReplaceMemberAvatarInput
): Promise<{ id: string; name: string }> {
  const ext = extForMemberAvatarMime(input.mime)
  const imageFile_id = randomUUID().replace(/-/g, '')
  const dir = avatarStorageDir()
  await mkdir(dir, { recursive: true })
  const diskName = `${imageFile_id}.${ext}`
  await writeFile(path.join(dir, diskName), input.fileBuffer)

  const created = await prisma.$transaction(async (tx) => {
    if (input.prevAvatarId) {
      const old = await tx.memberAvatar.findUnique({
        where: { id: input.prevAvatarId },
      })
      if (old) {
        await tryUnlinkAvatarFile(old)
        await tx.memberAvatar.delete({ where: { id: old.id } })
      }
      await tx.member.update({
        where: { id: input.memberId },
        data: { avatarId: null },
      })
    }
    const row = await tx.memberAvatar.create({
      data: {
        name: input.uploadName,
        imageFile_id,
        imageFile_extension: ext,
        imageFile_filesize: input.fileSize,
      },
    })
    await tx.member.update({
      where: { id: input.memberId },
      data: { avatarId: row.id },
    })
    return row
  })

  return { id: String(created.id), name: created.name }
}

export type RemoveMemberAvatarResult =
  | { kind: 'ok'; data: { id: string } }
  | { kind: 'not_found' }

/** `DELETE /v1/members/me/avatar`. Returns `not_found` when no avatar is set. */
export async function removeMemberAvatar(
  userId: string
): Promise<RemoveMemberAvatarResult> {
  const member = await prisma.member.findUnique({
    where: { twreporter_user_id: userId },
    select: { id: true, avatarId: true },
  })
  if (!member?.avatarId) return { kind: 'not_found' }

  const old = await prisma.memberAvatar.findUnique({
    where: { id: member.avatarId },
  })
  if (!old) return { kind: 'not_found' }

  await tryUnlinkAvatarFile(old)
  await prisma.$transaction([
    prisma.member.update({
      where: { id: member.id },
      data: { avatarId: null },
    }),
    prisma.memberAvatar.delete({ where: { id: old.id } }),
  ])

  return { kind: 'ok', data: { id: String(old.id) } }
}
