import { graphql, list } from '@keystone-6/core'
import { text, timestamp, virtual } from '@keystone-6/core/fields'

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
    email: text({
      label: 'Email',
      isIndexed: true,
    }),
    twreporter_user_id: text({
      label: 'membership_user.users.id',
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
          fieldMode: 'hidden',
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
      initialColumns: ['id', 'name', 'email'],
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
