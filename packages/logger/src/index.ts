import {
  NormalizedTraceContext,
  StructuredLogPayload,
  TraceHeaderInput,
} from './types.js'

const TRACEPARENT_HEADER = 'traceparent'
const XCLOUD_TRACE_HEADER = 'x-cloud-trace-context'
const TRACEPARENT_VERSION = '00'

const TRACE_ID_REGEX = /^[a-f0-9]{32}$/i
const SPAN_ID_REGEX = /^[a-f0-9]{16}$/i

const CONSOLE_BY_SEVERITY: Record<string, 'log' | 'warn' | 'error'> = {
  ALERT: 'error',
  CRITICAL: 'error',
  ERROR: 'error',
  WARNING: 'warn',
  NOTICE: 'log',
  INFO: 'log',
  DEBUG: 'log',
}

function getHeaderValue(input: TraceHeaderInput, headerName: string) {
  if (!input) {
    return undefined
  }
  if (typeof Headers !== 'undefined' && input instanceof Headers) {
    return input.get(headerName) || undefined
  }
  const lowered = headerName.toLowerCase()
  for (const [key, value] of Object.entries(input)) {
    if (key.toLowerCase() === lowered && typeof value === 'string') {
      return value
    }
  }
  return undefined
}

function getRandomHex(length: number) {
  const bytes = new Uint8Array(Math.ceil(length / 2))
  if (
    globalThis.crypto &&
    typeof globalThis.crypto.getRandomValues === 'function'
  ) {
    globalThis.crypto.getRandomValues(bytes)
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256)
    }
  }
  return Array.from(bytes, (value) => value.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, length)
}

function parseTraceparent(
  traceparent?: string
): { traceId: string; spanId: string; sampled: boolean } | undefined {
  if (!traceparent) {
    return undefined
  }
  const parts = traceparent.trim().split('-')
  if (parts.length !== 4) {
    return undefined
  }
  const [, traceId, spanId, traceFlags] = parts
  if (!TRACE_ID_REGEX.test(traceId) || !SPAN_ID_REGEX.test(spanId)) {
    return undefined
  }
  return {
    traceId: traceId.toLowerCase(),
    spanId: spanId.toLowerCase(),
    sampled: traceFlags.toLowerCase() === '01',
  }
}

function parseSpanId(rawSpanId?: string) {
  if (!rawSpanId) {
    return undefined
  }
  const span = rawSpanId.trim()
  if (SPAN_ID_REGEX.test(span)) {
    return span.toLowerCase()
  }
  if (/^\d+$/.test(span)) {
    try {
      const normalized = BigInt(span).toString(16).padStart(16, '0').slice(-16)
      if (SPAN_ID_REGEX.test(normalized)) {
        return normalized
      }
    } catch {
      return undefined
    }
  }
  return undefined
}

function parseXCloudTraceContext(
  xCloudTraceContext?: string
): { traceId: string; spanId: string; sampled: boolean } | undefined {
  if (!xCloudTraceContext) {
    return undefined
  }
  const [traceAndSpan, options] = xCloudTraceContext.trim().split(';')
  const [traceId, rawSpanId] = traceAndSpan.split('/')
  if (!TRACE_ID_REGEX.test(traceId)) {
    return undefined
  }
  return {
    traceId: traceId.toLowerCase(),
    spanId: parseSpanId(rawSpanId) || getRandomHex(16),
    sampled: options ? options.includes('o=1') : false,
  }
}

function formatXCloudSpanId(spanId: string) {
  return BigInt(`0x${spanId}`).toString(10)
}

export function normalizeTraceContext(
  headersInput?: TraceHeaderInput,
  options: { generateIfMissing?: boolean } = {}
): NormalizedTraceContext | undefined {
  const shouldGenerate = options.generateIfMissing !== false
  const traceparent = getHeaderValue(headersInput, TRACEPARENT_HEADER)
  const xCloudTraceContext = getHeaderValue(headersInput, XCLOUD_TRACE_HEADER)
  const parsed =
    parseTraceparent(traceparent) || parseXCloudTraceContext(xCloudTraceContext)

  if (!parsed && !shouldGenerate) {
    return undefined
  }

  const context = parsed || {
    traceId: getRandomHex(32),
    spanId: getRandomHex(16),
    sampled: true,
  }
  const traceFlags = context.sampled ? '01' : '00'
  const normalizedTraceparent = `${TRACEPARENT_VERSION}-${context.traceId}-${context.spanId}-${traceFlags}`
  const normalizedXCloudTraceContext = `${context.traceId}/${formatXCloudSpanId(context.spanId)};o=${context.sampled ? 1 : 0}`

  return {
    traceId: context.traceId,
    spanId: context.spanId,
    sampled: context.sampled,
    traceparent: normalizedTraceparent,
    xCloudTraceContext: normalizedXCloudTraceContext,
    traceHeaders: {
      'X-Cloud-Trace-Context': normalizedXCloudTraceContext,
      traceparent: normalizedTraceparent,
    },
  }
}

export function getGcpTraceField({
  projectId,
  traceId,
}: {
  projectId?: string
  traceId: string
}) {
  if (!projectId || !traceId) {
    return undefined
  }
  return `projects/${projectId}/traces/${traceId}`
}

export function getTraceLogFields(
  headersInput?: TraceHeaderInput,
  options: { projectId?: string; generateIfMissing?: boolean } = {}
) {
  const traceContext = normalizeTraceContext(headersInput, {
    generateIfMissing: options.generateIfMissing ?? false,
  })
  if (!traceContext) {
    return {}
  }

  const projectId =
    options.projectId ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCP_PROJECT
  const traceField = getGcpTraceField({
    projectId,
    traceId: traceContext.traceId,
  })

  return {
    ...(traceField ? { 'logging.googleapis.com/trace': traceField } : {}),
    traceId: traceContext.traceId,
    spanId: traceContext.spanId,
    traceparent: traceContext.traceparent,
    'x-cloud-trace-context': traceContext.xCloudTraceContext,
  }
}

export function emitStructured(payload: StructuredLogPayload) {
  const severity =
    typeof payload?.severity === 'string'
      ? payload.severity.toUpperCase()
      : 'INFO'
  const method = CONSOLE_BY_SEVERITY[severity] || 'log'
  const message = JSON.stringify(payload)

  if (method === 'error') {
    console.error(message)
    return
  }
  if (method === 'warn') {
    console.warn(message)
    return
  }
  console.log(message)
}
