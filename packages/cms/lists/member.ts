import { graphql, list } from '@keystone-6/core'
import {
  checkbox,
  integer,
  relationship,
  text,
  timestamp,
  virtual,
} from '@keystone-6/core/fields'

import type { ListType } from '../types/keystone-list-types'
import {
  makeMemberOwnedFilter,
  memberOwnedOperationAccess,
} from './utils/member-owned-access'

const operationAccessControl = memberOwnedOperationAccess
const filterAccessControl = makeMemberOwnedFilter('self')

export default list<ListType<'Member'>>({
  fields: {
    name: text({
      label: '稱呼',
    }),
    nickname: text({
      label: '暱稱',
    }),
    email: text({
      label: 'Email',
      isIndexed: true,
    }),
    contactEmail: text({
      label: '聯絡信箱',
    }),
    twreporter_user_id: text({
      label: 'TWReporter Membership ID',
      validation: { isRequired: true },
      isIndexed: 'unique',
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: 'read',
        },
        listView: {
          fieldMode: 'read',
        },
      },
      access: {
        create: () => false,
        update: () => false,
      },
    }),
    role: text({
      defaultValue: 'member',
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: 'read',
        },
        listView: {
          fieldMode: 'hidden',
        },
      },
      access: {
        create: () => false,
        update: () => false,
      },
    }),
    twoFactorAuth: virtual({
      field: graphql.field({
        type: graphql.JSON,
        async resolve() {
          return {
            bypass: true,
          }
        },
      }),
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: 'hidden',
        },
        listView: {
          fieldMode: 'hidden',
        },
      },
    }),
    showBaodaozai: checkbox({
      label: '是否顯示報導仔',
      defaultValue: true,
    }),
    essayQuestionCount: integer({
      label: '思辨題數量',
      defaultValue: 1,
    }),
    avatar: relationship({
      ref: 'MemberAvatar',
      many: false,
      label: '大頭照',
    }),
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
    updatedAt: timestamp({
      db: {
        updatedAt: true,
      },
    }),
  },
  ui: {
    listView: {
      initialColumns: ['id', 'twreporter_user_id', 'name', 'email'],
    },
  },
  db: {
    idField: {
      kind: 'cuid',
    },
  },
  access: {
    operation: {
      query: operationAccessControl,
      create: operationAccessControl,
      update: operationAccessControl,
      delete: operationAccessControl,
    },
    filter: {
      query: filterAccessControl,
      update: filterAccessControl,
      delete: filterAccessControl,
    },
  },
  hooks: {},
})
