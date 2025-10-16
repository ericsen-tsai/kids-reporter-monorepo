import { blockRenderers } from '@kids-reporter/draft-renderer'
import React, { useState } from 'react'
import styled from 'styled-components'

import { AtomicBlockProps } from '../block-renderer-fn.type'
import { InfoBoxInput, InfoBoxInputValue } from '../buttons/info-box'
import { EditableBlock as _EditableBlock } from './styled'

const { InfoBoxInArticleBody } = blockRenderers

const StyledInfoBox = styled(InfoBoxInArticleBody)``

const EditableBlock = styled(_EditableBlock)`
  &:hover {
    ${StyledInfoBox} {
      background-color: #f0f0f0;
      opacity: 0.3;
    }
`

export function EditableInfoBox(props: AtomicBlockProps<InfoBoxInputValue>) {
  const [isInputOpen, setIsInputOpen] = useState(false)
  const { block, blockProps, contentState } = props
  const { onEditStart, onEditFinish } = blockProps
  const entityKey = block.getEntityAt(0)
  const entity = contentState.getEntity(entityKey)
  const data = entity.getData()

  const onInputChange = (inputValue: InfoBoxInputValue) => {
    // close `BlockquoteInput`
    setIsInputOpen(false)

    onEditFinish({
      entityKey,
      entityData: inputValue,
    })
  }

  return (
    <React.Fragment>
      <InfoBoxInput
        isOpen={isInputOpen}
        onCancel={() => {
          setIsInputOpen(false)
          onEditFinish()
        }}
        onConfirm={onInputChange}
        inputValue={data}
      />
      <EditableBlock
        component={<StyledInfoBox data={data} />}
        onClick={() => {
          onEditStart()
          setIsInputOpen(true)
        }}
      />
    </React.Fragment>
  )
}
