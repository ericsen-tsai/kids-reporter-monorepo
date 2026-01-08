import { controller } from '@keystone-6/core/fields/types/virtual/views'
import { FieldProps } from '@keystone-6/core/types'
import { Button } from '@keystone-ui/button'
import { FieldContainer, FieldLabel } from '@keystone-ui/fields'
import React from 'react'

export const Field = ({ value }: FieldProps<typeof controller>) => {
  if (typeof value === 'object' && value !== null) {
    const href = value['href']
    const target = value['target'] || '_blank'
    const label = value['label']
    const buttonLabel = value['buttonLabel']

    return (
      <FieldContainer>
        <FieldLabel>{label}</FieldLabel>
        <a href={href} target={target} style={{ textDecoration: 'none' }}>
          <Button>{buttonLabel}</Button>
        </a>
      </FieldContainer>
    )
  } else {
    return null
  }
}
