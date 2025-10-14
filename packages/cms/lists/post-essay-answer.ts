import { list } from '@keystone-6/core'
import { relationship, text, timestamp } from '@keystone-6/core/fields'
import { allowRoles, RoleEnum } from './utils/access-control-list'

const operationAccessControl = allowRoles([
  RoleEnum.Admin,
  RoleEnum.Owner,
  RoleEnum.Member,
])

const filterAccessControl = ({ session }: { session?: any }) => {
  const role = session?.data?.role
  if (role === RoleEnum.Admin || role === RoleEnum.Owner) {
    return true
  }
  const memberID = session?.data?.member?.id
  if (memberID) {
    return { member: { id: { equals: memberID } } }
  }
  return false
}

export default list({
  fields: {
    question: relationship({
      label: '思辨題',
      ref: 'PostEssayQuestion',
      many: false,
      ui: {
        hideCreate: true,
      },
    }),
    member: relationship({
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
    compositeKey: text({
      label: '唯一鍵',
      ui: {
        createView: { fieldMode: 'hidden' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
      isIndexed: 'unique',
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
    hideCreate: true,
    createView: {
      defaultFieldMode: 'hidden',
    },
    itemView: {
      defaultFieldMode: 'read',
    },
    listView: {
      initialColumns: ['id', 'question', 'member', 'compositeKey'],
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
