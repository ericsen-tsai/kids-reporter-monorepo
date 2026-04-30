import './schemas/extra-openapi-paths.js'
import './schemas/qna.js'

import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'

import { registry } from './schemas/content.js'

export function getOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions)
  return generator.generateDocument({
    openapi: '3.0.3',
    info: {
      title: 'Kids Reporter Content API',
      version: '0.0.1',
      description:
        'Content API: health, `GET /openapi.json` + `/docs` (Swagger UI), `/auth/access-token` (cookie to JWT), and REST under `/v1/*`. Authenticated member routes require `Authorization: Bearer <JWT>` (Go API–issued HS256; verify with `GO_API_JWT_SECRET`, `GO_API_JWT_ISSUER`, `GO_API_JWT_AUDIENCE`).',
    },
  })
}
