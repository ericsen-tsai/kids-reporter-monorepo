/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type express from 'express'

declare global {
  namespace Express {
    interface Request {
      goApiJwtUserId?: string
    }
  }
}

export {}
