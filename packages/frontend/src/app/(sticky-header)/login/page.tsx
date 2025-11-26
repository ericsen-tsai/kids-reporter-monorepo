import envVars from '@/environment-variables'

export default async function Login({
  searchParams,
}: {
  searchParams: {
    destination?: string
  }
}) {
  const destination = searchParams.destination
    ? searchParams.destination
    : 'https://kids.twreporter.org'

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
