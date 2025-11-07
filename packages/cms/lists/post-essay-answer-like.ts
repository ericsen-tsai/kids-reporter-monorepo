import { list } from '@keystone-6/core'
import { relationship, text, timestamp } from '@keystone-6/core/fields'

import type { ListType } from '../types/keystone-list-types'
import { allowRoles, RoleEnum } from './utils/access-control-list'
import {
  makeMemberOwnedFilter,
  memberOwnedOperationAccess,
} from './utils/member-owned-access'

const memberFieldName = 'member'

const operationAccessControl = memberOwnedOperationAccess
const filterAccessControl = makeMemberOwnedFilter(memberFieldName)

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
    // @TODO: uncomment after testing ok
    //hideCreate: true,
    //createView: {
    //  defaultFieldMode: 'hidden',
    //},
    //itemView: {
    //  defaultFieldMode: 'read',
    //},
    listView: {
      initialColumns: ['id', 'answer', 'member'],
    },
  },
  db: { idField: { kind: 'autoincrement' } },
  access: {
    operation: {
      query: operationAccessControl,
      create: allowRoles([RoleEnum.Member]),
      update: allowRoles([RoleEnum.Member]),
      delete: operationAccessControl,
    },
    filter: {
      query: filterAccessControl,
      update: filterAccessControl,
      delete: filterAccessControl,
    },
  },
  hooks: {
    resolveInput: async ({ resolvedData, item, context, operation }) => {
      const answerId = resolvedData.answer?.connect?.id ?? item?.answerId
      const memberId = item?.memberId?.toString()

      const sessionMemberId = context.session?.data?.memberId?.toString()

      if (!sessionMemberId) {
        throw new Error('You must be signed in as a member to submit a like.')
      }

      if (operation === 'create') {
        // connect the answer to the member
        resolvedData.member = {
          connect: {
            id: sessionMemberId,
          },
        }
      } else if (operation === 'update') {
        if (sessionMemberId !== memberId) {
          throw new Error('You cannot edit the like for another member.')
        }
      }

      if (answerId) {
        resolvedData.compositeKey = `${answerId}:${sessionMemberId}`
      }

      return resolvedData
    },
  },
})
