// @ts-ignore `@twreporter/errors` does not have typescript definition file yet
import _errors from '@twreporter/errors'
import express from 'express'

import consts from '../constants.js'
import { buildAuthContext } from '../graphql/auth.js'
import { callCmsGraphql } from '../graphql/cms-client.js'
import { operations } from '../graphql/operations.js'
import { ensureRecord, parseVars } from '../graphql/operations/shared.js'

const errors = _errors.default
const statusCodes = consts.statusCodes
const MAX_LOG_BODY_BYTES = 1024
const SLOW_THRESHOLD_MS = consts.slowThresholdMs
const CLIENT_GQL_ERROR_CODES = new Set([
  'BAD_USER_INPUT',
  'GRAPHQL_VALIDATION_FAILED',
])

const summarizeParams = (
  variables: Record<string, unknown>
): Record<string, unknown> | undefined => {
  const summary: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(variables)) {
    const lowerKey = key.toLowerCase()
    if (
      lowerKey.endsWith('take') &&
      typeof value === 'number' &&
      Number.isFinite(value)
    ) {
      summary[key] = value
    }
    if (lowerKey.endsWith('orderby') && Array.isArray(value)) {
      summary[`${key}Count`] = value.length
    }
  }

  const skipValue = variables.skip
  if (typeof skipValue === 'number' && Number.isFinite(skipValue)) {
    summary.skip = skipValue
  }

  if (typeof variables.nextCursor === 'string') {
    summary.nextCursorLength = variables.nextCursor.length
  }

  return Object.keys(summary).length ? summary : undefined
}

const logResponse = (
  res: express.Response,
  status: number,
  payload: unknown,
  startAt?: bigint,
  operation?: string,
  variables?: Record<string, unknown>
) => {
  const elapsedMs = startAt
    ? // Convert high-resolution nanoseconds to milliseconds.
      Number(process.hrtime.bigint() - startAt) / 1e6
    : undefined
  const isSlow =
    typeof elapsedMs === 'number' ? elapsedMs >= SLOW_THRESHOLD_MS : false
  const params = isSlow && variables ? summarizeParams(variables) : undefined
  let serialized = ''
  let serializeError: string | undefined
  try {
    serialized = JSON.stringify(payload)
  } catch (err) {
    serialized = '"[unserializable payload]"'
    serializeError = (err as Error).message
  }

  const byteLength = Buffer.byteLength(serialized, 'utf8')
  const errorInfo = serializeError
    ? { unserializable: true, serializeError }
    : null
  let bodyForLog: unknown = errorInfo
  if (!bodyForLog) {
    if (status === statusCodes.ok) {
      bodyForLog = { byteLength }
    } else if (byteLength > MAX_LOG_BODY_BYTES) {
      bodyForLog = {
        truncated: true,
        byteLength,
        preview: serialized.slice(0, MAX_LOG_BODY_BYTES),
      }
    } else {
      bodyForLog = payload
    }
  }

  console.log(
    JSON.stringify({
      severity: isSlow ? 'WARNING' : 'INFO',
      message: 'GraphQL REST response',
      status,
      elapsedMs,
      slow: isSlow,
      operation,
      params,
      body: bodyForLog,
      ...res?.locals?.globalLogFields,
    })
  )
}

const logAndSend = (
  res: express.Response,
  status: number,
  payload: unknown,
  startAt?: bigint,
  operation?: string,
  variables?: Record<string, unknown>
) => {
  logResponse(res, status, payload, startAt, operation, variables)
  return res.status(status).json(payload)
}

export function createGqlRestRouter({
  apiOrigin,
  headlessAccount,
}: {
  apiOrigin: string
  headlessAccount: { email: string; password: string }
}) {
  const router = express.Router()

  // Register method-specific handlers for each operation
  Object.entries(operations).forEach(([operationName, op]) => {
    const method = op.method.toLowerCase() as keyof express.Router
    const methodFn = router[method]

    if (typeof methodFn === 'function') {
      ;(
        methodFn as (
          this: express.Router,
          path: string,
          handler: express.RequestHandler
        ) => void
      ).call(router, `/api/rest/${operationName}`, async (req, res) => {
        const startAt = process.hrtime.bigint()
        let variables
        try {
          const input = ensureRecord(parseVars(req), 'Missing variables')
          variables = op.buildVariables(input)
        } catch (err) {
          const payload = {
            status: 'fail',
            data: {
              message: 'buildVariables fails. ' + (err as Error).message,
            },
          }
          return logAndSend(
            res,
            statusCodes.badRequest,
            payload,
            startAt,
            operationName
          )
        }

        let authContext
        try {
          authContext = await buildAuthContext({
            req,
            apiOrigin,
            headlessAccount,
            auth: op.auth,
          })
        } catch (err) {
          const payload = {
            status: 'fail',
            data: {
              message: 'buildAuthContext fails. ' + (err as Error).message,
            },
          }
          return logAndSend(
            res,
            statusCodes.badRequest,
            payload,
            startAt,
            operationName,
            variables
          )
        }

        try {
          const gqlRes = await callCmsGraphql({
            apiOrigin,
            document: op.document,
            variables,
            operationName: op.operationName,
            headers: authContext.headers,
            originalCookie: authContext.originalCookie,
            mode: authContext.mode,
            tokenManager: authContext.tokenManager,
          })

          if (op.auth === 'auth') {
            res.set('Cache-Control', 'no-store')
          } else if (op.cacheTtl && op.method === 'GET') {
            res.set('Cache-Control', `public, max-age=${op.cacheTtl}`)
          }

          const gqlPayload = gqlRes?.data

          if (gqlPayload?.errors?.length) {
            const hasClientError = gqlPayload.errors.some(
              (error: { extensions?: { code?: string } }) =>
                CLIENT_GQL_ERROR_CODES.has(error?.extensions?.code ?? '')
            )
            const status = hasClientError
              ? statusCodes.badRequest
              : statusCodes.internalServerError
            const payload = {
              status: 'error',
              message: 'CMS GraphQL responded with errors',
              errors: gqlPayload.errors,
            }
            return logAndSend(
              res,
              status,
              payload,
              startAt,
              operationName,
              variables
            )
          }

          const payload = {
            status: 'success',
            data: gqlPayload?.data ?? {},
          }
          return logAndSend(
            res,
            statusCodes.ok,
            payload,
            startAt,
            operationName,
            variables
          )
        } catch (err) {
          const annotatedErr = errors.helpers.wrap(
            err,
            'GraphQLRestError',
            'Failed to call CMS GraphQL'
          )
          console.log(
            JSON.stringify({
              severity: 'ERROR',
              message: errors.helpers.printAll(annotatedErr, {
                withStack: true,
                withPayload: true,
              }),
              ...res?.locals?.globalLogFields,
            })
          )
          const payload = {
            status: 'error',
            message: 'Failed to process request',
          }
          return logAndSend(
            res,
            statusCodes.internalServerError,
            payload,
            startAt,
            operationName,
            variables
          )
        }
      })
    }
  })

  router.all('/api/rest/:operation', (req, res) => {
    const startAt = process.hrtime.bigint()
    const op = operations[req.params.operation]
    if (!op) {
      const payload = {
        status: 'fail',
        data: {
          message: `Unknown operation: '${req.params.operation}'. Available operations: [${Object.keys(operations).join(', ')}]`,
        },
      }
      return logAndSend(
        res,
        statusCodes.badRequest,
        payload,
        startAt,
        req.params.operation
      )
    }
    const payload = {
      status: 'fail',
      data: { message: `Use ${op.method}` },
    }
    return logAndSend(
      res,
      statusCodes.methodNotAllowed,
      payload,
      startAt,
      req.params.operation
    )
  })

  return router
}
