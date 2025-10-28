import { list, graphql } from '@keystone-6/core'
import { relationship, text, timestamp, virtual } from '@keystone-6/core/fields'
import { allowRoles, RoleEnum } from './utils/access-control-list'
import {
  memberOwnedOperationAccess,
  makeMemberOwnedFilter,
} from './utils/member-owned-access'
import type { ListType } from '../types/keystone-list-types'

const memberFieldName = 'member'

const operationAccessControl = memberOwnedOperationAccess
const filterAccessControl = makeMemberOwnedFilter(memberFieldName)

export default list<ListType<'PostEssayAnswer'>>({
  fields: {
    question: relationship({
      label: '思辨題',
      ref: 'PostEssayQuestion',
      many: false,
      ui: {
        hideCreate: true,
      },
    }),
    [memberFieldName]: relationship({
      label: '會員',
      ref: 'Member',
      many: false,
      ui: {
        hideCreate: true,
      },
    }),
    content: text({
      label: '內容',
      validation: { isRequired: true },
    }),
    likesCount: virtual({
      field: graphql.field({
        type: graphql.Int,
        async resolve(item, args, context) {
          const answerId = item.id

          // Intentionally bypasses PostEssayAnswerLike list ACL via Prisma.
          // Make sure this resolver already enforced authorization.
          const count = await context.sudo().db.PostEssayAnswerLike.count({
            where: { answer: { id: { equals: answerId.toString() } } },
          })

          return count ?? 0
        },
      }),
      ui: {
        itemView: { fieldMode: 'read' },
        listView: { fieldMode: 'read' },
      },
    }),
    compositeKey: text({
      label: '唯一鍵',
      ui: {
        createView: { fieldMode: 'hidden' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
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
        itemView: { fieldMode: 'read' },
      },
    }),
    updatedAt: timestamp({
      db: { updatedAt: true },
      ui: {
        createView: { fieldMode: 'hidden' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
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
      initialColumns: ['id', 'question', 'member'],
    },
  },
  db: { idField: { kind: 'autoincrement' } },
  access: {
    operation: {
      query: allowRoles([
        RoleEnum.Admin,
        RoleEnum.Member,

        // Frontend needs to list essay answers publicly (read-only).
        RoleEnum.FrontendHeadlessAccount,
      ]),
      create: operationAccessControl,
      update: operationAccessControl,
      delete: operationAccessControl,
    },
    filter: {
      // Do NOT apply member-owned query filter here
      // Frontend must fetch answers across members for listing
      // Warning: ensure sensitive fields are protected via field-level read ACL
      query: undefined,

      update: filterAccessControl,
      delete: filterAccessControl,
    },
  },
  hooks: {
    resolveInput: async ({ resolvedData, item }) => {
      const questionId = resolvedData.question?.connect?.id ?? item?.questionId
      const memberId = resolvedData.member?.connect?.id ?? item?.memberId

      if (questionId && memberId) {
        // Use relational question id + member id as uniqueness
        resolvedData.compositeKey = `${questionId}:${memberId}`
      }

      return resolvedData
    },
  },
})
