// @ts-ignore `@twreporter/errors` does not have typescript definition file yet
import _errors from '@twreporter/errors'

import consts from '../constants.js'

export const errors = _errors.default
export const statusCodes = consts.statusCodes
export const slowThresholdMs = consts.slowThresholdMs
export const clientGqlErrorCodes = new Set([
  'BAD_USER_INPUT',
  'GRAPHQL_VALIDATION_FAILED',
])
