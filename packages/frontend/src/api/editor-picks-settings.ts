import type { V1EditorPicksSettingsResponseSchema } from '@kids-reporter/api-types'
import type { z } from 'zod'

import { getEditorPicksSettingsContentApi } from '@/api/content-api/editor-picks-settings'

export const getEditorPicksSettings = async (
  { take }: { take?: number },
  traceHeaders?: Record<string, string>
): Promise<z.infer<typeof V1EditorPicksSettingsResponseSchema>> => {
  return await getEditorPicksSettingsContentApi({ take, traceHeaders })
}
