import {
  GetEditorPicksSettingsQuery,
  GetEditorPicksSettingsQueryVariables,
} from '__generated__/operations/editor-picks-settings.generated'

import { sendGQLRequest } from '@/utils'

import { GET_EDITOR_PICKS_SETTINGS_GQL } from './graphql/editor-picks-settings'

export const getEditorPicksSettings = async (
  variables: GetEditorPicksSettingsQueryVariables
) => {
  const response = await sendGQLRequest<GetEditorPicksSettingsQuery>({
    query: GET_EDITOR_PICKS_SETTINGS_GQL,
    variables,
  })
  return response?.data?.data?.editorPicksSettings
}
