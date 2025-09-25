// @ts-ignore `@twreporter/errors` does not have tyepscript definition file yet
import _errors from '@twreporter/errors'
import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'

import consts from './constants.js'
import envVar from './environment-variables.js'

// @twreporter/errors is a CommonJS module, so we must access its `default` property
const errors = _errors.default

const statusCodes = consts.statusCodes

const apiOrigin = envVar.apis.goApi.origin

/**
 * Creates an Auth mini app.
 *
 * This mini app exposes the `/auth/access-token` endpoint,
 * which proxies requests to the Go API (`/v2/auth/token`)
 * and returns an `access_token` for authenticated twreporter
 * and kids-reporter users.
 */
export function createAuthMiniApp() {
  // Create an Express router
  const router = express.Router()

  // Enable preflight requests (CORS OPTIONS)
  router.options('/auth/access-token')

  router.post(
    '/auth/access-token',
    // proxy request to go-api endpoint
    createProxyMiddleware({
      target: apiOrigin,
      changeOrigin: true,
      logLevel: 'debug',
      pathRewrite: {
        '/auth/access-token': '/v2/auth/token',
      },
      onError: (err, req, res) => {
        const annotatedErr = errors.helpers.wrap(
          err,
          'GoApiProxyError',
          `Error occurs while proxying request to API origin server: ${apiOrigin} ` +
            err.message
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

        res.status(statusCodes.internalServerError).send({
          status: 'error',
          error: annotatedErr.message,
        })
      },
    })
  )

  return router
}
