export enum LogLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

export const log = (level: LogLevel = LogLevel.INFO, msg: string) => {
  const isInBrowser = typeof window !== 'undefined'
  const structuredMsg = JSON.stringify({
    severity: level,
    message: msg,
    ...(!isInBrowser && level === LogLevel.ERROR
      ? {
          '@type':
            'type.googleapis.com/google.devtools.clouderrorreporting.v1beta1.ReportedErrorEvent',
        }
      : {}),
  })

  switch (level) {
    case LogLevel.ERROR: {
      console.error(structuredMsg)
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
