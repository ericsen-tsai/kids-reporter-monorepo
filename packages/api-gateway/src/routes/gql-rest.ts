// @ts-ignore `@twreporter/errors` does not have typescript definition file yet
import _errors from '@twreporter/errors'
import express from 'express'

import consts from '../constants.js'
import { buildAuthContext } from '../graphql/auth.js'
import { callCmsGraphql } from '../graphql/cms-client.js'
import { operations } from '../graphql/operations.js'

const errors = _errors.default
const statusCodes = consts.statusCodes

export function createGqlRestRouter({
  apiOrigin,
  headlessAccount,
}: {
  apiOrigin: string
  headlessAccount: { email: string; password: string }
}) {
  const router = express.Router()
  router.use(express.json({ limit: '1mb' }))

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
        let variables
        try {
          variables = op.buildVariables(req)
        } catch (err) {
          return res.status(statusCodes.badRequest).json({
            status: 'fail',
            data: {
              message: 'buildVariables fails. ' + (err as Error).message,
            },
          })
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
          return res.status(statusCodes.badRequest).json({
            status: 'fail',
            data: {
              message: 'buildAuthContext fails. ' + (err as Error).message,
            },
          })
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
            return res.status(statusCodes.internalServerError).json({
              status: 'error',
              message: 'CMS GraphQL responded with errors',
              errors: gqlPayload.errors,
            })
          }

          return res.status(statusCodes.ok).json({
            status: 'success',
            data: gqlPayload?.data ?? {},
          })
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
          return res.status(statusCodes.internalServerError).json({
            status: 'error',
            message: 'Failed to process request',
          })
        }
      })
    }
  })

  router.all('/api/rest/:operation', (req, res) => {
    const op = operations[req.params.operation]
    if (!op) {
      return res.status(statusCodes.badRequest).json({
        status: 'fail',
        data: {
          message: `Unknown operation: '${req.params.operation}'. Available operations: [${Object.keys(operations).join(', ')}]`,
        },
      })
    }
    return res.status(statusCodes.methodNotAllowed).json({
      status: 'fail',
      data: { message: `Use ${op.method}` },
    })
  })

  return router
}
