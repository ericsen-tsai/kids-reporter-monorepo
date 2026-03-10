export type LogSeverity =
  | 'DEBUG'
  | 'INFO'
  | 'NOTICE'
  | 'WARNING'
  | 'ERROR'
  | 'ALERT'
  | 'CRITICAL'

export type StructuredLogPayload = {
  severity: LogSeverity
  message?: string
} & Record<string, unknown>

export type TraceHeaderInput =
  | Headers
  | Record<string, string | undefined | unknown>
  | undefined

export type NormalizedTraceContext = {
  traceId: string
  spanId: string
  sampled: boolean
  traceparent: string
  xCloudTraceContext: string
  traceHeaders: {
    'X-Cloud-Trace-Context': string
    traceparent: string
  }
}
