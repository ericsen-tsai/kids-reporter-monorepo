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
        { label: '文章頁', value: 'article' },
        { label: '專題頁', value: 'topic' },
        { label: '新聞集合頁', value: 'news' },
        { label: '搜尋頁', value: 'search' },
        { label: '教案集合頁', value: 'lessons' },
        { label: 'podcast集合頁', value: 'podcasts' },
        { label: '關於我們', value: 'aboutUs' },
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
