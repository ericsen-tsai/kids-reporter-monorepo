import { list } from '@keystone-6/core'
import { integer, relationship, text, timestamp } from '@keystone-6/core/fields'

import type { ListType } from '../types/keystone-list-types'
import { allowRoles, RoleEnum } from './utils/access-control-list'

const staffWriteRoles = [
  RoleEnum.Owner,
  RoleEnum.Admin,
  RoleEnum.Developer,
  RoleEnum.Editor,
  RoleEnum.Contributor,
]

const memberFieldName = 'member'

export default list<ListType<'PostEssayAnswer'>>({
  fields: {
    question: relationship({
      label: '思辨題',
      ref: 'PostEssayQuestion.answers',
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
      graphql: {
        omit: {
          create: true,
          update: true,
        },
      },
    }),
    content: text({
      label: '內容',
      validation: { isRequired: true },
    }),
    likesCount: integer({
      label: '按讚數',
      defaultValue: 0,
      db: {
        isNullable: false,
      },
      ui: {
        itemView: { fieldMode: 'read' },
        listView: { fieldMode: 'read' },
        createView: { fieldMode: 'hidden' },
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
      isIndexed: true,
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
      initialColumns: ['id', 'question', 'member'],
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
      update: undefined,
      delete: undefined,
    },
  },
})
