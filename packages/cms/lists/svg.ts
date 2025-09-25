import { graphql, list } from '@keystone-6/core'
import {
  file,
  relationship,
  text,
  timestamp,
  virtual,
} from '@keystone-6/core/fields'

import config from '../config'
import {
  allowAllRoles,
  allowRoles,
  RoleEnum,
} from './utils/access-control-list'
import type { ListConfig } from '@keystone-6/core/types'
const listConfigurations: ListConfig<any> = list({
  fields: {
    name: text({
      label: '標題',
      validation: { isRequired: true },
    }),
    svgFile: file({
      label: '上傳 SVG 檔案',
      storage: 'files',
    }),
    authors: relationship({
      label: '作者',
      ref: 'Author',
      many: true,
    }),
    embeddedCode: virtual({
      field: graphql.field({
        type: graphql.String,
        async resolve(item: Record<string, any>, args, context) {
          const itemId = item?.id
          const { svgFile } = await context.query.SVG.findOne({
            where: { id: itemId },
            query: 'svgFile { url }',
          })

          return `<img src="${config.googleCloudStorage.origin}${svgFile.url}" alt="${item.name}">`
        },
      }),
      ui: {
        views: './lists/views/embedded-code',
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
    label: 'SVG',
    listView: {
      initialColumns: ['name'],
      initialSort: { field: 'updatedAt', direction: 'ASC' },
      pageSize: 50,
    },
  },

  access: {
    operation: {
      query: allowAllRoles(),
      create: allowRoles([
        RoleEnum.Owner,
        RoleEnum.Admin,
        RoleEnum.Editor,
        RoleEnum.Contributor,
      ]),
      update: allowRoles([RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Editor]),
      delete: allowRoles([RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Editor]),
    },
  },
})

export default listConfigurations
