import { DrawerProvider } from '@keystone-ui/modals'
import { EditorState } from 'draft-js'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

import { RichTextEditor } from '../src/index'

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container!)

function Editor() {
  const [editorState, setEditorState] = useState<EditorState>()
  return (
    <RichTextEditor
      disabledButtons={['code', 'code-block']}
      editorState={editorState}
      onChange={(editorState) => {
        setEditorState(editorState)
      }}
    />
  )
}

root.render(
  <div>
    <DrawerProvider>
      <Editor />
    </DrawerProvider>
  </div>
)
