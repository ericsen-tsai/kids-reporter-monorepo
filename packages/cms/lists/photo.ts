import { graphql, list } from '@keystone-6/core'
import {
  image,
  relationship,
  text,
  timestamp,
  virtual,
} from '@keystone-6/core/fields'
import { ListType } from 'types'

import config from '../config'
import envVar from '../environment-variables'
import {
  allowAllRoles,
  allowRoles,
  RoleEnum,
} from './utils/access-control-list'

export default list<ListType<'Photo'>>({
  fields: {
    name: text({
      label: '標題',
      validation: { isRequired: true },
    }),
    imageFile: image({
      storage: 'images',
    }),
    authors: relationship({
      label: '作者',
      ref: 'Author',
      many: true,
    }),
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
    updatedAt: timestamp({
      db: {
        updatedAt: true,
      },
    }),
    resized: virtual({
      field: graphql.field({
        type: graphql.object<{
          original: string
          tiny: string
          small: string
          medium: string
          large: string
        }>()({
          name: 'ResizedImages',
          fields: {
            original: graphql.field({ type: graphql.String }),
            tiny: graphql.field({ type: graphql.String }),
            small: graphql.field({ type: graphql.String }),
            medium: graphql.field({ type: graphql.String }),
            large: graphql.field({ type: graphql.String }),
          },
        }),
        resolve(item: Record<string, unknown>) {
          const empty = {
            original: '',
            tiny: '',
            small: '',
            medium: '',
            large: '',
          }

          // For backward compatibility,
          // this image item is uploaded via `GCSFile` custom field.
          if (item?.urlOriginal) {
            return Object.assign(empty, {
              original: item.urlOriginal,
            })
          }

          const rtn: Record<string, string> = {}
          const filename = item?.imageFile_id

          if (!filename) {
            return empty
          }

          const extension = item?.imageFile_extension
            ? '.' + item.imageFile_extension
            : ''

          const resizedTargets = {
            tiny: 400,
            small: 800,
            medium: 1200,
            large: 2000,
          }

          Object.entries(resizedTargets).forEach(([key, value]) => {
            const resizedFilename =
              envVar.nodeEnv !== 'production'
                ? `${filename}${extension}`
                : `${filename}-${value}.webp`
            rtn[key] =
              `${config.googleCloudStorage.origin}/resized/${resizedFilename}`
          })

          rtn['original'] =
            `${config.googleCloudStorage.origin}/images/${filename}${extension}`
          return Object.assign(empty, rtn)
        },
      }),
      ui: {
        query: '{ original tiny small medium large }',
        views: './lists/views/resized-image',
      },
    }),
  },
  ui: {
    label: 'Photos',
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
        RoleEnum.Member,
      ]),
      update: allowRoles([RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Editor]),
      delete: allowRoles([RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Editor]),
    },
  },
})
