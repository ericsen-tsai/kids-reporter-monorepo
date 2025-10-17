import { controller } from '@keystone-6/core/fields/types/json/views'
import type { FieldProps } from '@keystone-6/core/types'
import { Button } from '@keystone-ui/button'
import { Box } from '@keystone-ui/core'
import { FieldContainer, FieldLabel, TextInput } from '@keystone-ui/fields'
import React from 'react'

type OptionItem = {
  content: string
  isCorrectAnswer: boolean
}

function normalize(v: unknown): OptionItem[] {
  if (!Array.isArray(v)) return []
  return v
    .map((o) => {
      if (!o || typeof o !== 'object') return null
      const content = typeof o.content === 'string' ? o.content : ''
      const isCorrectAnswer = o.isCorrectAnswer === true
      return { content, isCorrectAnswer }
    })
    .filter(Boolean) as OptionItem[]
}

export function Field(props: FieldProps<typeof controller>) {
  const { value: _value, onChange, autoFocus } = props
  const parsed = _value ? JSON.parse(_value) : []
  const options = normalize(parsed)

  const set = (opts: OptionItem[]) => onChange?.(JSON.stringify(opts))

  const setContent = (idx: number, content: string) => {
    const next = options.slice()
    next[idx] = { ...next[idx], content }
    set(next)
  }

  const setCorrect = (idx: number) => {
    const next = options.map((o, i) => ({ ...o, isCorrectAnswer: i === idx }))
    set(next)
  }

  const addOption = () =>
    set([...options, { content: '', isCorrectAnswer: options.length === 0 }])

  const removeOption = (idx: number) => {
    const wasCorrect = options[idx]?.isCorrectAnswer
    const next = options.filter((_, i) => i !== idx)
    if (wasCorrect && next.length) {
      // ensure one remains correct
      next[0] = { ...next[0], isCorrectAnswer: true }
    }
    set(next)
  }

  return (
    <FieldContainer>
      <FieldLabel>選項</FieldLabel>
      <Box marginTop="small">
        {options.map((opt, i) => (
          <Box key={i} marginTop="small">
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <TextInput
                autoFocus={autoFocus && i === 0}
                size="small"
                width="large"
                value={opt.content}
                onChange={(e) => setContent(i, e.target.value)}
                placeholder={`選項 ${i + 1}`}
              />
              <div style={{ minWidth: 'fit-content' }}>
                <input
                  type="radio"
                  name="correct"
                  checked={opt.isCorrectAnswer === true}
                  onChange={() => setCorrect(i)}
                />
                <span style={{ fontSize: '14px', fontWeight: 'normal' }}>
                  正確答案
                </span>
              </div>
              <Button
                size="small"
                tone="negative"
                onClick={() => removeOption(i)}
              >
                刪除
              </Button>
            </div>
          </Box>
        ))}
        <Box marginTop="small">
          <Button size="small" onClick={addOption}>
            新增選項
          </Button>
        </Box>
      </Box>
    </FieldContainer>
  )
}
