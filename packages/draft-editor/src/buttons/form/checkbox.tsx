import React from 'react'
import styled from 'styled-components'

const CheckboxBlock = styled.div`
  margin: 10px 0;
  display: flex;
  align-items: center;
`

const Label = styled.label`
  display: flex;
  align-items: center;
  margin: 10px 0;
  font-weight: 600;
  cursor: pointer;
`

const CheckboxInput = styled.input`
  margin-right: 8px;
  cursor: pointer;
`

type CheckboxProps = {
  label: string
  checked: boolean
  onChange: (arg0: boolean) => void
}

export function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <CheckboxBlock>
      <Label>
        <CheckboxInput
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            onChange(e.target.checked)
          }}
        />
        {label}
      </Label>
    </CheckboxBlock>
  )
}
