export enum LogLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

export const log = (level: LogLevel = LogLevel.INFO, msg: string) => {
  const structuredMsg = JSON.stringify({
    severity: level,
    message: msg,
  })

  switch (level) {
    case LogLevel.ERROR: {
      // Follow https://cloud.google.com/error-reporting/docs/formatting-error-messages doc to print structured error log
      // and trigger GCP error reporting.
      const errorLogEntry = {
        severity: level,
        '@type':
          'type.googleapis.com/google.devtools.clouderrorreporting.v1beta1.ReportedErrorEvent',
        message: msg,
      }
      console.error(JSON.stringify(errorLogEntry))
      return
    }
    case LogLevel.WARNING:
      console.warn(structuredMsg)
      return
    case LogLevel.INFO:
    default:
      console.log(structuredMsg)
      return
  }
}
