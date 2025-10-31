// @ts-ignore `@twreporter/errors` does not have tyepscript definition file yet
import _errors from '@twreporter/errors'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'

import { createAuthMiniApp } from './auth-mini-app.js'
import consts from './constants.js'
import { createGraphQLProxy } from './gql-proxy-mini-app.js'
import middlewareCreator from './middlewares/index.js'

// @twreporter/errors is a cjs module, therefore, we need to use its default property
const errors = _errors.default
const statusCodes = consts.statusCodes

/**
 *  This function creates an express application.
 *  This application aims to
 *
 *  1. create GraphQLProxy mini app. The mini app proxy incoming requests
 *  to the backed API origin server.
 */
export function createApp({
  gcpProjectId = 'kids-reporter',
  corsAllowOrigin = [],
  gql,
}: {
  gcpProjectId?: string
  corsAllowOrigin: string[] | string
  gql: {
    headlessAccount: {
      email: string
      password: string
    }
    apiOrigin: string
  }
}) {
  // create express app
  const app = express()

  const corsOpts = {
    origin: corsAllowOrigin,
    credentials: true,
  }

  // common middlewares for every request
  // 1. log requests
  // 2. handle cors requests
  // 3. parse header cookie
  app.use(
    middlewareCreator.createLoggerMw(gcpProjectId),
    cors(corsOpts),
    cookieParser()
  )

  // mini app: GraphQL API
  app.use(createGraphQLProxy(gql))

  // Auth mini app
  app.use(createAuthMiniApp())

  /**
   *  Application level error handler
   */
  const errorHandler: express.ErrorRequestHandler = (
    err,
    req,
    res,
    /* eslint-disable-line */ next
  ) => {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnknownError',
      'Express error handler catches an unknown error'
    )

    const entry = Object.assign(
      {
        severity: 'ERROR',
        // All exceptions that include a stack trace will be
        // integrated with Error Reporting.
        // See https://cloud.google.com/run/docs/error-reporting
        message: errors.helpers.printAll(
          annotatingError,
          {
            withStack: true,
            withPayload: true,
          },
          0,
          0
        ),
      },
      res.locals.globalLogFields
    )
    console.error(JSON.stringify(entry))
    res.status(statusCodes.internalServerError).send({
      status: 'error',
      error: annotatingError.error,
    })
  }

  app.use(errorHandler)

  return app
}
