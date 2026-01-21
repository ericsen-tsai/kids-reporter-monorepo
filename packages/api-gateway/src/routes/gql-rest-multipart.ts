import express from 'express'
import {
  createProxyMiddleware,
  responseInterceptor,
} from 'http-proxy-middleware'

import { logResponse } from './gql-rest-logger.js'
import { clientGqlErrorCodes, errors, statusCodes } from './gql-rest-shared.js'

const operationName = 'create-member-avatar'

export const createMultipartProxy = ({ apiOrigin }: { apiOrigin: string }) => {
  const respondMultipart = ({
    res,
    status,
    payload,
  }: {
    res: express.Response
    status: number
    payload: unknown
  }) => {
    res.set('Cache-Control', 'no-store')
    logResponse(res, status, payload, res.locals.gqlRestStartAt, operationName)
    res.status(status)
    return JSON.stringify(payload)
  }

  // Stream multipart uploads directly to GraphQL to avoid buffering files in memory.
  return createProxyMiddleware({
    target: apiOrigin,
    changeOrigin: true,
    pathRewrite: () => '/api/graphql',
    selfHandleResponse: true,
    onProxyReq: (proxyReq, req, res) => {
      const expressRes = res as express.Response
      const authContext = expressRes.locals.gqlRestAuthContext
      if (authContext?.mode === 'jwt') {
        proxyReq.setHeader('Authorization', authContext.headers.Authorization)
        proxyReq.removeHeader?.('Cookie')
      } else if (authContext?.mode === 'cookie') {
        if (authContext.headers?.Cookie) {
          proxyReq.setHeader('Cookie', authContext.headers.Cookie)
        }
        proxyReq.removeHeader?.('Authorization')
      }
    },
    onProxyRes: responseInterceptor(
      async (responseBuffer, proxyRes, req, res) => {
        const expressRes = res as express.Response
        const rawBody = responseBuffer.toString('utf8')
        let gqlPayload: { data?: unknown; errors?: unknown } | undefined
        try {
          gqlPayload = rawBody ? JSON.parse(rawBody) : undefined
        } catch (_err) {
          const payload = {
            status: 'error',
            message: 'Invalid response from upstream GraphQL',
          }
          return respondMultipart({
            res: expressRes,
            status: statusCodes.internalServerError,
            payload,
          })
        }

        if (gqlPayload?.errors) {
          const hasClientError = Array.isArray(gqlPayload.errors)
            ? gqlPayload.errors.some(
                (error: { extensions?: { code?: string } }) =>
                  clientGqlErrorCodes.has(error?.extensions?.code ?? '')
              )
            : false
          const status = hasClientError
            ? statusCodes.badRequest
            : statusCodes.internalServerError
          const payload = {
            status: 'error',
            message: 'CMS GraphQL responded with errors',
            errors: gqlPayload.errors,
          }
          return respondMultipart({ res: expressRes, status, payload })
        }

        const payload = {
          status: 'success',
          data: gqlPayload?.data ?? {},
        }
        return respondMultipart({
          res: expressRes,
          status: statusCodes.ok,
          payload,
        })
      }
    ),
    onError: (err, req, res) => {
      const annotatedErr = errors.helpers.wrap(
        err,
        'GraphQLRestProxyError',
        'Failed to proxy multipart request'
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
      res.writeHead(statusCodes.internalServerError, {
        'Content-Type': 'application/json',
      })
      res.end(
        JSON.stringify({
          status: 'error',
          message: 'Failed to proxy multipart request',
        })
      )
    },
  })
}
