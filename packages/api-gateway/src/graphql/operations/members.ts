import {
  DELETE_MEMBER_AVATAR_MUTATION,
  GET_MEMBER_ESSAY_ANSWERS_HAS_LIKED_QUERY,
  GET_MEMBER_POSTS_WITH_ANSWERS_QUERY,
  GET_MEMBER_PROFILE_QUERY,
  UPDATE_MEMBER_PROFILE_MUTATION,
} from '../documents/members.js'
import { ensureRecord, Operation, toInt } from './shared.js'

export const operations: Record<string, Operation> = {
  'member-profile': {
    method: 'GET',
    auth: 'auth',
    operationName: 'GetMemberProfile',
    document: GET_MEMBER_PROFILE_QUERY,
    buildVariables: (input) => {
      return { where: ensureRecord(input.where, 'Missing where') }
    },
  },
  'update-member-profile': {
    method: 'POST',
    auth: 'auth',
    operationName: 'UpdateMemberProfile',
    document: UPDATE_MEMBER_PROFILE_MUTATION,
    buildVariables: (input) => {
      return {
        where: ensureRecord(input.where, 'Missing where'),
        data: ensureRecord(input.data, 'Missing data'),
      }
    },
  },
  'member-posts-with-answers': {
    method: 'GET',
    auth: 'auth',
    operationName: 'GetMemberPostsWithAnswers',
    document: GET_MEMBER_POSTS_WITH_ANSWERS_QUERY,
    buildVariables: (input) => {
      return {
        take: toInt(input.take),
        nextCursor:
          typeof input.nextCursor === 'string' ? input.nextCursor : undefined,
      }
    },
  },
  'delete-member-avatar': {
    method: 'POST',
    auth: 'auth',
    operationName: 'DeleteMemberAvatar',
    document: DELETE_MEMBER_AVATAR_MUTATION,
    buildVariables: (input) => {
      return { where: ensureRecord(input.where, 'Missing where') }
    },
  },
  'member-essay-answers-has-liked': {
    method: 'GET',
    auth: 'auth',
    operationName: 'GetMemberEssayAnswersHasLiked',
    document: GET_MEMBER_ESSAY_ANSWERS_HAS_LIKED_QUERY,
    buildVariables: (input) => {
      if (!Array.isArray(input.essayAnswerIds)) {
        throw new Error('Missing essayAnswerIds')
      }
      return { essayAnswerIds: input.essayAnswerIds }
    },
  },
}
