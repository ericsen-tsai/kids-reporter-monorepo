import { getCallBaodaozaiIntroContentApi } from '@/api/content-api/call-baodaozai-intro'

export async function getCallBaodaozaiIntroContent(
  { page }: { page: string },
  traceHeaders?: Record<string, string>
): Promise<string | undefined> {
  return await getCallBaodaozaiIntroContentApi({ page, traceHeaders })
}
