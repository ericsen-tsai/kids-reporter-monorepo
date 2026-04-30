/* eslint-disable @typescript-eslint/consistent-type-definitions */
declare global {
  namespace Express {
    interface Request {
      /** go-api JWT `user_id` claim (stringified), set after Bearer verification. */
      goApiJwtUserId?: string
    }
  }
}

export {}
