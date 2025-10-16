import { list } from '@keystone-6/core'
import {
  integer,
  relationship,
  text,
  timestamp,
  checkbox,
} from '@keystone-6/core/fields'
import {
  memberOwnedOperationAccess,
  makeMemberOwnedFilter,
} from './utils/member-owned-access'
import type { ListType } from '../types/keystone-list-types'

const memberFieldName = 'member'

const operationAccessControl = memberOwnedOperationAccess
const filterAccessControl = makeMemberOwnedFilter(memberFieldName)

export default list<ListType<'PostChoiceAnswer'>>({
  fields: {
    question: relationship({
      label: '單選題',
      ref: 'PostChoiceQuestion',
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
    }),
    choiceIndex: integer({
      label: '作答選項索引',
      validation: { isRequired: true },
    }),
    correct: checkbox({
      label: '是否答對',
      defaultValue: false,
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
    }),
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
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
      initialColumns: [
        'id',
        'question',
        'member',
        'choiceIndex',
        'correct',
        'compositeKey',
      ],
    },
  },
  db: { idField: { kind: 'autoincrement' } },
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
  hooks: {
    resolveInput: async ({ resolvedData, item, context }) => {
      const questionId = resolvedData.question?.connect?.id ?? item?.questionId
      const memberId = resolvedData.member?.connect?.id ?? item?.memberId

      if (questionId && memberId) {
        // Use relational question id + member id as uniqueness
        resolvedData.compositeKey = `${questionId}:${memberId}`
      }

      const choiceIndex = resolvedData.choiceIndex
      if (typeof choiceIndex === 'number' && choiceIndex >= 0) {
        // find out the choice is correct or not
        const q = await context.sudo().query.PostChoiceQuestion.findOne({
          where: { id: questionId?.toString() },
          query: 'id options',
        })
        const correctIndex = q?.options?.findIndex(
          (o: { isCorrectAnswer: boolean }) => o.isCorrectAnswer === true
        )
        resolvedData.correct = choiceIndex === correctIndex
      }

      return resolvedData
    },
  },
})
