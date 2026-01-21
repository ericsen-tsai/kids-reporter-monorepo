import { richTextEditor } from './custom-fields/rich-text-editor'
import addManualOrderRelationshipFields from './utils/manual-order-relationship'

// @ts-ignore: draft-editor is not typed
export { buttonNames as richTextEditorButtonNames } from '@kids-reporter/draft-editor'

export const customFields = {
  richTextEditor,
}

export const utils = {
  addManualOrderRelationshipFields,
}

export default {
  customFields,
  utils,
}
