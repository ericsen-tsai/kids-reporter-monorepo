import { emitStructured } from '@kids-reporter/logger'

export function logContentApiFallback(operation: string, err: unknown) {
  const reason = err instanceof Error ? err.message : String(err)
  emitStructured({
    severity: 'WARNING',
    message: 'content-api request failed; falling back to api-gateway',
    context: { operation, reason },
  })
}
