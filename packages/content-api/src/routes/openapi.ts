import { getOpenApiDocument } from '@kids-reporter/api-types'
import express, { NextFunction, Request, Response } from 'express'
import swaggerUi from 'swagger-ui-express'

export function createOpenApiRouter({ basePath = '' } = {}) {
  const router = express.Router()

  router.get('/openapi.json', (_req, res) => {
    res.set('Cache-Control', 'no-store')
    res.json(getOpenApiDocument())
  })

  router.use(
    '/docs',
    swaggerUi.serve,
    (req: Request, res: Response, next: NextFunction) => {
      swaggerUi.setup(undefined, {
        swaggerOptions: {
          url: `${basePath}/openapi.json`,
        },
      })(req, res, next)
    }
  )

  return router
}
