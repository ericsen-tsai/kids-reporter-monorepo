# @kids-reporter/logger

Shared structured logger and trace utilities for Kids Reporter services. Supports W3C `traceparent` and Google Cloud `X-Cloud-Trace-Context` headers for distributed tracing and GCP log correlation.

## Types

- **`LogSeverity`** — `'DEBUG' | 'INFO' | 'NOTICE' | 'WARNING' | 'ERROR' | 'ALERT' | 'CRITICAL'`
- **`StructuredLogPayload`** — `{ severity: LogSeverity; message?: string } & Record<string, unknown>`
- **`TraceHeaderInput`** — `Headers | Record<string, string | undefined | unknown> | undefined`
- **`NormalizedTraceContext`** — Normalized trace ID, span ID, sampled flag, and formatted `traceparent` / `x-cloud-trace-context` plus a `traceHeaders` object for outbound requests

## API

### `normalizeTraceContext(headersInput?, options?)`

Parses trace context from request headers (`traceparent` or `X-Cloud-Trace-Context`). Optionally generates new trace/span IDs when none are present.

- **`headersInput`** — Request headers (e.g. `Headers` or plain object).
- **`options.generateIfMissing`** — If `true` (default), creates new trace/span when headers are missing; if `false`, returns `undefined` in that case.

**Returns:** `NormalizedTraceContext` or `undefined`.

```ts
import { normalizeTraceContext } from '@kids-reporter/logger'

const ctx = normalizeTraceContext(request.headers)
// ctx.traceId, ctx.spanId, ctx.traceparent, ctx.traceHeaders, ...
```

### `getTraceLogFields(headersInput?, options?)`

Builds an object of trace-related fields suitable for structured logging (e.g. JSON logs). Includes `logging.googleapis.com/trace` when `projectId` is set for GCP log correlation.

- **`headersInput`** — Same as `normalizeTraceContext`.
- **`options.projectId`** — GCP project ID for the trace field; falls back to `GOOGLE_CLOUD_PROJECT` or `GCP_PROJECT` env vars.
- **`options.generateIfMissing`** — Same as `normalizeTraceContext` (default `false` here).

**Returns:** Object with `traceId`, `spanId`, `traceparent`, `x-cloud-trace-context`, and optionally `logging.googleapis.com/trace`.

```ts
import { getTraceLogFields } from '@kids-reporter/logger'

const fields = getTraceLogFields(req.headers, { projectId: 'my-gcp-project' })
console.log(JSON.stringify({ ...fields, message: 'Request processed' }))
```

### `getGcpTraceField({ projectId, traceId })`

Returns the GCP trace resource name: `projects/{projectId}/traces/{traceId}`. Returns `undefined` if `projectId` or `traceId` is missing.

### `emitStructured(payload)`

Writes a structured log entry to the console as JSON. Uses `console.error` for ERROR/ALERT/CRITICAL, `console.warn` for WARNING, and `console.log` for others.

```ts
import { emitStructured } from '@kids-reporter/logger'

emitStructured({
  severity: 'INFO',
  message: 'User signed in',
  userId: 'usr_123',
  ...getTraceLogFields(request.headers),
})
```
