import { list } from '@keystone-6/core'
import { select, text, timestamp } from '@keystone-6/core/fields'

import {
  allowAllRoles,
  allowRoles,
  RoleEnum,
} from './utils/access-control-list'

export default list({
  fields: {
    page: select({
      type: 'enum',
      options: [
        { label: '首頁', value: 'home' },
        { label: '最新頁', value: 'all' },
        { label: '集合頁-專題', value: 'topics' },
        { label: '集合頁-新聞', value: 'news' },
        { label: '集合頁-多媒體', value: 'storytelling' },
        { label: '集合頁-校園', value: 'campus' },
        { label: '集合頁-Podcast', value: 'listeningNews' },
        { label: '集合頁-教案', value: 'classroom' },
      ],
      validation: { isRequired: true },
      isIndexed: 'unique',
    }),
    content: text(),
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
      ui: {
        createView: { fieldMode: 'hidden' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    updatedAt: timestamp({
      db: {
        updatedAt: true,
      },
      ui: {
        createView: { fieldMode: 'hidden' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
  },
  access: {
    operation: {
      query: allowAllRoles(),
      create: allowRoles([RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Editor]),
      update: allowRoles([RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Editor]),
      delete: allowRoles([RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Editor]),
    },
  },
  ui: {
    listView: {
      initialColumns: ['page', 'content'],
    },
  },
})
