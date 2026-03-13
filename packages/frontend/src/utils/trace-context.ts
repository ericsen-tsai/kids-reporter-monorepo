import {
  normalizeTraceContext,
  type TraceHeaderInput,
} from '@kids-reporter/logger'

export function buildTraceHeaders(input?: TraceHeaderInput) {
  const normalized = normalizeTraceContext(input, {
    generateIfMissing: true,
  })
  return normalized.traceHeaders
}

export function getServerTraceHeaders(requestHeaders: Headers) {
  const record: Record<string, string> = {}
  requestHeaders.forEach((value, key) => {
    record[key] = value
  })
  return buildTraceHeaders(record)
}
