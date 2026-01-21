import express from 'express'

import consts from '../constants.js'

/**
 *  Follow [Writing structured logs](https://cloud.google.com/run/docs/logging#writing_structured_logs)
 *  doc to do logging.
 *
 *  @param {Object} req
 *  @param {Function} req
 *  @param {string} projectId
 *  @return {Object} globalLogFields
 */
function getGlobalLogFields(req: express.Request, projectId: string) {
  const globalLogFields: { 'logging.googleapis.com/trace'?: string } = {}

  // Add log correlation to nest all log messages beneath request log in Log Viewer.
  const traceHeader = req.header('X-Cloud-Trace-Context')
  if (traceHeader && projectId) {
    const [trace] = traceHeader.split('/')
    globalLogFields['logging.googleapis.com/trace'] =
      `projects/${projectId}/traces/${trace}`
  }
  return globalLogFields
}

/**
 *  Create an express middleware to log request.
 */
export function createLoggerMw(projectId: string): express.RequestHandler {
  const handler: express.RequestHandler = (req, res, next) => {
    const globalLogFields = getGlobalLogFields(req, projectId)
    const startAt = process.hrtime.bigint()
    let logged = false
    const slowThresholdMs = consts.slowThresholdMs

    const authHeader = req.get('Authorization')
    const safeAuthHeader =
      authHeader && authHeader.startsWith('Bearer ')
        ? 'Bearer ***REDACTED***'
        : authHeader
          ? '***REDACTED***'
          : undefined

    const logResponse = (event: 'finish' | 'close') => {
      if (logged) {
        return
      }
      logged = true
      // Convert high-resolution nanoseconds to milliseconds.
      const elapsedMs = Number(process.hrtime.bigint() - startAt) / 1e6
      const isSlow = elapsedMs >= slowThresholdMs

      console.log(
        JSON.stringify({
          severity: isSlow ? 'WARNING' : 'INFO',
          message: `Response: ${req.method} ${req.originalUrl}`,
          status: res.statusCode,
          elapsedMs,
          event,
          slow: isSlow,
          ...globalLogFields,
        })
      )
    }

    res.once('finish', () => logResponse('finish'))
    res.once('close', () => logResponse('close'))

    console.log(
      JSON.stringify({
        severity: 'INFO',
        message: `Request: ${req.method} ${req.originalUrl}`,
        debugPayload: {
          'req.headers': {
            'Content-Length': req.get('Content-Length'),
            'Content-Type': req.get('Content-Type'),
            Authorization: safeAuthHeader,
          },
          'req.body': req.body,
        },
        ...globalLogFields,
      })
    )

    res.locals.globalLogFields = globalLogFields

    next()
  }
  return handler
}
