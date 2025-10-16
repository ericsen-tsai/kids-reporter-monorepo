import { list } from '@keystone-6/core'
import { relationship, text, timestamp } from '@keystone-6/core/fields'
import {
  makeMemberOwnedFilter,
  memberOwnedOperationAccess,
} from './utils/member-owned-access'
import type { ListType } from '../types/keystone-list-types'

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
          update: true,
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
    listView: {
      initialColumns: ['id', 'answer', 'member'],
    },
  },
  db: { idField: { kind: 'autoincrement' } },
  access: {
    operation: {
      query: memberOwnedOperationAccess,
      create: memberOwnedOperationAccess,
      update: memberOwnedOperationAccess,
      delete: memberOwnedOperationAccess,
    },
    filter: {
      query: makeMemberOwnedFilter('member'),
      update: makeMemberOwnedFilter('member'),
      delete: makeMemberOwnedFilter('member'),
    },
  },
  hooks: {
    resolveInput: async ({ resolvedData, item }) => {
      const answerId = resolvedData.answer?.connect?.id ?? item?.answerId
      const memberId = resolvedData.member?.connect?.id ?? item?.memberId
      if (answerId && memberId) {
        resolvedData.compositeKey = `${answerId}:${memberId}`
      }
      return resolvedData
    },
  },
})
