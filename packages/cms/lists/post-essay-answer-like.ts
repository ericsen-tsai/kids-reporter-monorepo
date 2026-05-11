import { list } from '@keystone-6/core'
import { relationship, text, timestamp } from '@keystone-6/core/fields'

import type { Context } from '../types/keystone-context'
import type { ListType } from '../types/keystone-list-types'
import { allowRoles, RoleEnum } from './utils/access-control-list'

function resolveAnswerIdFromItem(item: {
  answerId?: unknown
  answer?: { id?: unknown }
}): number | undefined {
  const answerIdRaw = item.answerId
  const fromRelation = item.answer?.id
  const n =
    typeof answerIdRaw === 'number'
      ? answerIdRaw
      : typeof answerIdRaw === 'string'
        ? Number(answerIdRaw)
        : typeof fromRelation === 'number'
          ? fromRelation
          : typeof fromRelation === 'string'
            ? Number(fromRelation)
            : undefined
  return n === undefined || Number.isNaN(n) ? undefined : n
}

const staffWriteRoles = [
  RoleEnum.Owner,
  RoleEnum.Admin,
  RoleEnum.Developer,
  RoleEnum.Editor,
  RoleEnum.Contributor,
]

export default list<ListType<'PostEssayAnswerLike'>>({
  fields: {
    answer: relationship({
      label: '思辨題答案',
      ref: 'PostEssayAnswer',
      many: false,
      ui: { hideCreate: true },
    }),
    member: relationship({
      label: '會員',
      ref: 'Member',
      many: false,
      ui: { hideCreate: true },
      graphql: {
        omit: {
          create: true,
          update: true,
        },
      },
    }),
    compositeKey: text({
      label: '唯一鍵',
      ui: {
        createView: { fieldMode: 'hidden' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'hidden' },
      },
      isIndexed: 'unique',
      db: {
        isNullable: true,
      },
      graphql: {
        omit: {
          create: true,
        },
      },
      access: {
        create: () => false,
        update: () => false,
      },
    }),
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
      ui: {
        createView: { fieldMode: 'hidden' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'hidden' },
      },
    }),
    updatedAt: timestamp({
      db: { updatedAt: true },
      ui: {
        createView: { fieldMode: 'hidden' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'hidden' },
      },
    }),
  },
  ui: {
    labelField: 'id',
    hideCreate: true,
    createView: {
      defaultFieldMode: 'hidden',
    },
    itemView: {
      defaultFieldMode: 'read',
    },
    listView: {
      initialColumns: ['id', 'answer', 'member'],
    },
  },
  db: { idField: { kind: 'autoincrement' } },
  access: {
    operation: {
      query: allowRoles(staffWriteRoles),
      create: allowRoles([RoleEnum.Owner, RoleEnum.Admin]),
      update: allowRoles([RoleEnum.Owner, RoleEnum.Admin]),
      delete: allowRoles([RoleEnum.Owner, RoleEnum.Admin]),
    },
    filter: {
      query: undefined,
      delete: undefined,
    },
  },
  graphql: {
    omit: {
      update: true,
    },
  },
  hooks: {
    afterOperation: {
      create: async ({ item, context }) => {
        if (!item) return
        const answerId = resolveAnswerIdFromItem(item)
        if (answerId === undefined) return
        const ctx = context as Context
        await ctx.prisma.postEssayAnswer.update({
          where: { id: answerId },
          data: { likesCount: { increment: 1 } },
        })
      },
      delete: async ({ originalItem, context }) => {
        if (!originalItem) return
        const answerId = resolveAnswerIdFromItem(originalItem)
        if (answerId === undefined) return
        const ctx = context as Context
        await ctx.prisma.postEssayAnswer.updateMany({
          where: { id: answerId, likesCount: { gt: 0 } },
          data: { likesCount: { decrement: 1 } },
        })
      },
    },
  },
})
