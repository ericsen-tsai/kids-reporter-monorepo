import React from 'react'

import buttonNames from './buttons/bt-names'
import { editableAnchorDecorator } from './entity-decorators/anchor'
import { editableAnnotationDecorator } from './entity-decorators/annotation'
import { editableLinkDecorator } from './entity-decorators/link'
import { editableTOCAnchorDecorator } from './entity-decorators/toc-anchor'
import {
  RichTextEditor as _RichTextEditor,
  RichTextEditorWithoutDecoratorProps,
} from './rich-text-editor'

const RichTextEditor = (props: RichTextEditorWithoutDecoratorProps) => {
  return (
    <_RichTextEditor
      decorators={[
        editableAnnotationDecorator,
        editableLinkDecorator,
        editableTOCAnchorDecorator,
        editableAnchorDecorator,
      ]}
      {...props}
    />
  )
}

export { buttonNames, RichTextEditor }

export default {
  RichTextEditor,
  buttonNames,
}
