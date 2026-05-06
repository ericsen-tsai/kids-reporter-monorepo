import { V1CallBaodaozaiIntroPathParamsSchema } from '@kids-reporter/api-types'
import { prisma } from '@kids-reporter/db'
import type { z } from 'zod'

type CallBaodaozaiIntroPage = z.infer<
  typeof V1CallBaodaozaiIntroPathParamsSchema
>['page']

/** `GET /v1/call-baodaozai-intros/:page` */
export async function fetchCallBaodaozaiIntro(page: CallBaodaozaiIntroPage) {
  const intro = await prisma.callBaodaozaiIntro.findFirst({
    where: { page },
    select: { id: true, page: true, content: true },
  })
  if (!intro) return null
  return {
    id: intro.id,
    page: intro.page,
    content: intro.content,
  }
}
