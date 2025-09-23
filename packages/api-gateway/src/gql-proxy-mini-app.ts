import axios from 'axios'
import consts from './constants.js'
// @ts-ignore `@twreporter/errors` does not have tyepscript definition file yet
import _errors from '@twreporter/errors'
import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'

// @twreporter/errors is a cjs module, therefore, we need to use its default property
const errors = _errors.default

const statusCodes = consts.statusCodes

class TokenManager {
  // Singleton
  static instance?: TokenManager
  private email: string
  private password: string
  private apiEndpoint: string
  private token: string
  private expiredAt?: number // timestamp

  constructor(
    email: string,
    password: string,
    apiEndpoint = 'http://localhost:3000/api/graphql'
  ) {
    this.email = email
    this.password = password
    this.apiEndpoint = apiEndpoint
    this.token = ''

    if (TokenManager.instance) {
      return TokenManager.instance
    }

    TokenManager.instance = this
  }

  /**
   *  This function will return a cache token if token is existed and not expired.
   */
  async getToken() {
    if (this.token && this.expiredAt && this.expiredAt >= Date.now()) {
      return this.token
    }

    // fetch token
    try {
      const sessionToken = await this._fetchToken()
      this.token = sessionToken

      // @TODO expiry time should be returned by API
      // So far, we set expiry time as one hour later
      this.expiredAt = Date.now() + 3600 * 1000

      return this.token
    } catch (err) {
      const annotatedErr = errors.helpers.wrap(
        err,
        'TokenManangerError',
        'Fail to get session token',
        {
          accoutEmail: this.email,
        }
      )
      throw annotatedErr
    }
  }

  /**
   *  This function will return a new token.
   */
  async renewToken() {
    try {
      const sessionToken = await this._fetchToken()
      this.token = sessionToken

      // @TODO expiry time should be returned by API
      // So far, we set expiry time as one hour later
      this.expiredAt = Date.now() + 3600 * 1000
      return this.token
    } catch (err) {
      const annotatedErr = errors.helpers.wrap(
        err,
        'TokenManangerError',
        'Fail to renew session token',
        {
          accoutEmail: this.email,
        }
      )
      throw annotatedErr
    }
  }

  async _fetchToken() {
    const gqlQuery = `
      mutation AuthenticateUserWithPassword($email: String!, $password: String!) {
        authenticateUserWithPassword(email: $email, password: $password) {
          ... on UserAuthenticationWithPasswordSuccess {
            sessionToken
          }
          ... on UserAuthenticationWithPasswordFailure {
            message
          }
        }
      }
    `

    let axiosRes
    // fetch token
    try {
      axiosRes = await axios.post(this.apiEndpoint, {
        query: gqlQuery,
        variables: {
          email: this.email,
          password: this.password,
        },
      })
    } catch (err) {
      throw errors.helpers.annotateAxiosError(err)
    }

    const authenticationResult =
      axiosRes.data?.data?.authenticateUserWithPassword
    const errorMessage = authenticationResult?.message
    if (errorMessage) {
      throw new Error(errorMessage)
    }

    const sessionToken = authenticationResult?.sessionToken
    if (!sessionToken) {
      throw new Error(
        'Session token "' + sessionToken + '" is not a valid string'
      )
    }

    return sessionToken
  }
}

// helpers
const isBearerAuth = (req: express.Request) => {
  const auth = req.get('authorization') || ''
  return auth.startsWith('Bearer ')
}

/**
 *  This function creates a `GraphQLProxy` mini app.
 *  This mini app aims to add 'keystonejs-session' cookie on incoming requests' header
 *  and proxy them to backed GraphQL API original server.
 */
export function createGraphQLProxy({
  headlessAccount,
  apiOrigin,
}: {
  headlessAccount: { email: string; password: string }
  apiOrigin: string
}) {
  // create express mini app
  const router = express.Router()

  // enable pre-flight request
  router.options('/api/graphql')

  // Decide auth mode + (maybe) fetch headless token
  router.post(
    '/api/graphql',
    // decide auth mode & fetch keystonejs-session only if needed
    async (req, res, next) => {
      const usingBearer = isBearerAuth(req)
      res.locals.authMode = usingBearer ? 'jwt' : 'cookie'

      if (usingBearer) {
        // JWT mode: do nothing here; just forward the Authorization header later
        return next()
      }

      // Cookie mode: fetch/ensure headless session token
      try {
        const tokenManager = new TokenManager(
          headlessAccount.email,
          headlessAccount.password,
          apiOrigin + '/api/graphql'
        )
        const token = await tokenManager.getToken()
        res.locals.sessionToken = token
      } catch (err) {
        console.log(
          JSON.stringify({
            severity: 'ERROR',
            message: errors.helpers.printAll(
              err,
              { withStack: true, withPayload: true },
              0,
              0
            ),
            ...res?.locals?.globalLogFields,
          })
        )
        // Even if headless token cannot be obtained, continue
        // and let Keystone respond with 401
      }
      next()
    },

    // proxy to Keystone GraphQL
    createProxyMiddleware({
      target: apiOrigin,
      changeOrigin: true,

      onProxyReq: (proxyReq, req, res) => {
        const mode: 'jwt' | 'cookie' = res.locals.authMode

        // Always enforce Content-Type
        proxyReq.setHeader('Content-Type', 'application/json')
        proxyReq.setHeader('x-apollo-operation-name', '')

        if (mode === 'jwt') {
          // Forward Authorization header
          proxyReq.setHeader('Authorization', req.get('Authorization') || '')

          console.log(
            JSON.stringify({
              severity: 'DEBUG',
              message: 'Proxy with Bearer JWT to ' + apiOrigin + proxyReq.path,
              ...res?.locals?.globalLogFields,
              debugPayload: {
                req: {
                  headers: {
                    authorization: '[REDACTED]',
                    'content-type': 'application/json',
                  },
                },
              },
            })
          )
          return
        }

        const originalCookie = req.get('Cookie') || ''
        // Cookie mode: attach keystonejs-session token
        const sessionToken = res.locals.sessionToken || ''
        const cookie = originalCookie
          ? `${originalCookie};keystonejs-session=${sessionToken}`
          : `keystonejs-session=${sessionToken}`

        proxyReq.setHeader('Cookie', cookie)
        // Ensure Authorization is not present to avoid ambiguity
        proxyReq.removeHeader?.('Authorization')

        console.log(
          JSON.stringify({
            severity: 'DEBUG',
            message:
              'Proxy with keystonejs-session to ' + apiOrigin + proxyReq.path,
            ...res?.locals?.globalLogFields,
            debugPayload: {
              req: {
                headers: {
                  cookie: '[REDACTED]',
                  'content-type': 'application/json',
                },
              },
            },
          })
        )
      },

      onProxyRes: async (proxyRes, req, res) => {
        const statusCode = proxyRes.statusCode
        const mode: 'jwt' | 'cookie' = res.locals.authMode

        // Renew only for cookie mode (headless flow)
        if (mode === 'cookie' && statusCode === 401) {
          console.log(
            JSON.stringify({
              severity: 'DEBUG',
              message:
                '401 from Keystone with cookie auth; try renewing headless session token',
              ...res?.locals?.globalLogFields,
            })
          )
          try {
            const tokenManager = new TokenManager(
              headlessAccount.email,
              headlessAccount.password,
              apiOrigin + '/api/graphql'
            )
            await tokenManager.renewToken()
          } catch (err) {
            const annotatedErr = errors.helpers.wrap(
              err,
              'GraphQLProxyError',
              'Error renewing headless session token'
            )
            console.log(
              JSON.stringify({
                severity: 'ERROR',
                message: errors.helpers.printAll(
                  annotatedErr,
                  { withStack: true, withPayload: true },
                  0,
                  0
                ),
                ...res?.locals?.globalLogFields,
              })
            )
          }
        }

        /**
         * Try to fix memory leak issue (#467). Cleanup listeners either way.
         */
        const cleanup = (err: Error) => {
          // cleanup event listeners to allow clean garbage collection
          proxyRes.removeListener('error', cleanup)
          proxyRes.removeListener('close', cleanup)
          res.removeListener('error', cleanup)
          res.removeListener('close', cleanup)
          // destroy all source streams to propagate the caught event backward
          req.destroy(err)
          proxyRes.destroy(err)
        }
        proxyRes.once('error', cleanup)
        proxyRes.once('close', cleanup)
        res.once('error', cleanup)
        res.once('close', cleanup)
      },

      onError: (err, req, res) => {
        const annotatedErr = errors.helpers.wrap(
          err,
          'GraphQLProxyError',
          `Error while proxying to API origin: ${apiOrigin}${err.message}`
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

  // unified error handler
  const errorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
    const annotatedErr = errors.helpers.wrap(
      err,
      'GraphQLProxyError',
      'Unknown error in GraphQLProxy mini app'
    )
    console.log(
      JSON.stringify({
        severity: 'ERROR',
        message: errors.helpers.printAll(err, {
          withStack: true,
          withPayload: true,
        }),
        ...res?.locals?.globalLogFields,
      })
    )
    // Let main application level error handle to deal with the error
    next(annotatedErr)
  }

  router.use(errorHandler)
  return router
}
