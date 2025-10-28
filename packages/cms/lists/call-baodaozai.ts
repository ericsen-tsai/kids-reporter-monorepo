import { list } from '@keystone-6/core'
import { text, timestamp } from '@keystone-6/core/fields'

import {
  allowAllRoles,
  allowRoles,
  RoleEnum,
} from './utils/access-control-list'

export default list({
  fields: {
    home: text({
      label: '首頁',
      validation: { isRequired: true },
    }),
    topics: text({
      label: '專題集合頁',
      validation: { isRequired: true },
    }),
    topic: text({
      label: '專題頁',
      validation: { isRequired: true },
    }),
    news: text({
      label: '新聞集合頁',
      validation: { isRequired: true },
    }),
    comics: text({
      label: '漫畫集合頁',
      validation: { isRequired: true },
    }),
    lessons: text({
      label: '教案集合頁',
      validation: { isRequired: true },
    }),
    podcasts: text({
      label: 'podcast集合頁',
      validation: { isRequired: true },
    }),
    aboutUs: text({
      label: '關於我們',
      validation: { isRequired: true },
    }),
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
        listView: { fieldMode: 'read' },
      },
    }),
    updatedAt: timestamp({
      db: {
        updatedAt: true,
      },
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
        listView: { fieldMode: 'read' },
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
    label: 'Call Baodaozai',
    singular: 'Call Baodaozai',
    plural: 'Call Baodaozai',
    listView: {
      initialColumns: [
        'home',
        'topics',
        'topic',
        'news',
        'comics',
        'lessons',
        'podcasts',
        'aboutUs',
      ],
    },
  },
})
