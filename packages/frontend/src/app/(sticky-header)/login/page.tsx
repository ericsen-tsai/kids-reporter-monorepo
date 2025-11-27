import envVars from '@/environment-variables'

const defaultDestination = 'https://kids.twreporter.org'
const allowedDestinationOrigins = new Set([
  'https://kids.twreporter.org',
  'https://dev-kids.twreporter.org',
  'https://ndx-kids.twreporter.org',
  'https://staging-kids.twreporter.org',
  ...(envVars.nodeEnv === 'development'
    ? ['http://localhost:3000', 'http://localhost:3001']
    : []),
])

function sanitizeDestination(rawDestination?: string) {
  if (!rawDestination) {
    return defaultDestination
  }

  try {
    const parsed = new URL(rawDestination)
    if (allowedDestinationOrigins.has(parsed.origin)) {
      return parsed.toString()
    }
  } catch {
    // fall through to default destination
  }

  return defaultDestination
}

export default async function Login({
  searchParams,
}: {
  searchParams: {
    destination?: string
  }
}) {
  const destination = sanitizeDestination(searchParams.destination)
  const iframeSrc = `${envVars.loginWidgetUrl}?destination=${encodeURIComponent(destination)}`

  return (
    <iframe
      className="h-screen w-full"
      src={iframeSrc}
      title="Login widget"
      allow="clipboard-read; clipboard-write"
    />
  )
}
