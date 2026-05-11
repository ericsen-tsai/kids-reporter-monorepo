import { list } from '@keystone-6/core'
import {
  checkbox,
  integer,
  relationship,
  text,
  timestamp,
} from '@keystone-6/core/fields'

import type { ListType } from '../types/keystone-list-types'
import {
  allowAllRoles,
  allowRoles,
  RoleEnum,
} from './utils/access-control-list'

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
    showBaodaozai: checkbox({
      label: '是否顯示報導仔',
      defaultValue: true,
    }),
    essayQuestionCount: integer({
      label: '思辨題數量',
      defaultValue: 1,
    }),
    avatar: relationship({
      ref: 'MemberAvatar.member',
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
      query: allowAllRoles(),
      create: allowRoles([RoleEnum.Owner, RoleEnum.Admin]),
      update: allowRoles([RoleEnum.Owner, RoleEnum.Admin]),
      delete: allowRoles([RoleEnum.Owner, RoleEnum.Admin]),
    },
  },
  hooks: {},
})
