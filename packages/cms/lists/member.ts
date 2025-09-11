import { list, graphql } from '@keystone-6/core'
import { text, timestamp, virtual } from '@keystone-6/core/fields'
import { allowRoles, RoleEnum } from './utils/access-control-list'

const operationAccessControl = allowRoles([
  RoleEnum.FrontendHeadlessAccount,
  RoleEnum.Admin,
  RoleEnum.Owner,
])

const filterAccessControl = ({ session }: { session?: any }) => {
  const userRole = session.data.role

  if (userRole === RoleEnum.Admin || userRole === RoleEnum.Owner) {
    return true
  }

  const memberID = session.data?.member?.id
  if (memberID) {
    return { id: { equals: memberID } }
  }

  return false
}

const listConfigurations = list({
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
      access: {
        read: allowRoles([RoleEnum.Admin, RoleEnum.Owner]),
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
          fieldMode: 'hidden',
        },
        listView: {
          fieldMode: 'hidden',
        },
      },
      access: {
        read: allowRoles([RoleEnum.Admin, RoleEnum.Owner]),
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
      access: {
        read: allowRoles([RoleEnum.Admin, RoleEnum.Owner]),
        create: () => false,
        update: () => false,
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

export default listConfigurations
