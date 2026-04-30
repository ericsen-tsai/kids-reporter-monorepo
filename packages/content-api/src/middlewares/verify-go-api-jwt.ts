import type { NextFunction, Request, Response } from 'express'

import consts from '../constants.js'
import { verifyGoApiAccessToken } from '../go-api-jwt.js'
import { sendJsonError } from '../send-json-error.js'

const statusCodes = consts.statusCodes

export function verifyGoApiJwt(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) {
    sendJsonError(res, statusCodes.unauthorized, 'unauthorized', 'Unauthorized')
    return
  }

  const token = auth.slice('Bearer '.length).trim()
  if (!token) {
    sendJsonError(res, statusCodes.unauthorized, 'unauthorized', 'Unauthorized')
    return
  }

  try {
    const decoded = verifyGoApiAccessToken(token)
    req.goApiJwtUserId = `${decoded.user_id}`
    next()
  } catch {
    sendJsonError(res, statusCodes.unauthorized, 'unauthorized', 'Unauthorized')
  }
}
