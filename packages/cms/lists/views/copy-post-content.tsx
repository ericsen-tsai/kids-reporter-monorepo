import { controller } from '@keystone-6/core/fields/types/virtual/views'
import { FieldProps } from '@keystone-6/core/types'
import { Button } from '@keystone-ui/button'
import { Box } from '@keystone-ui/core'
import { FieldContainer, FieldLabel } from '@keystone-ui/fields'
import { ClipboardIcon } from '@keystone-ui/icons/icons/ClipboardIcon'
import { convertFromRaw } from 'draft-js'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  cursor: pointer;
  user-select: none;
`

const CheckboxInput = styled.input`
  cursor: pointer;
`

const CheckboxLabel = styled.span`
  font-size: 14px;
  white-space: nowrap;
`

const FieldsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 4px;
  column-gap: 8px;
  margin-top: 12px;
  margin-bottom: 12px;
`

type FieldKey =
  | 'title'
  | 'subtitle'
  | 'brief'
  | 'content'
  | 'ogDescription'
  | 'opening'
  | 'postChoiceQuestions'
  | 'postEssayQuestions'

const fieldLabels: Record<FieldKey, string> = {
  title: '標題',
  subtitle: '副標',
  brief: '前言',
  content: '內文',
  ogDescription: 'og:description',
  opening: '進入對話',
  postChoiceQuestions: '選擇題組',
  postEssayQuestions: '思辨題組',
}

type ChoiceQuestionOption = {
  content: string
  isCorrectAnswer: boolean
}

type PostChoiceQuestion = {
  title: string
  options: ChoiceQuestionOption[]
  reason: string | null
}

type PostEssayQuestion = {
  title: string
  hint: string | null
}

type PostData = {
  id: string
  title: string | null
  subtitle: string | null
  brief: any
  content: any
  ogDescription: string | null
  opening: string | null
  postChoiceQuestions: PostChoiceQuestion[]
  postEssayQuestions: PostEssayQuestion[]
}

export const Field = ({ value }: FieldProps<typeof controller>) => {
  const post = value as PostData | null
  const [selectedFields, setSelectedFields] = useState<Set<FieldKey>>(
    new Set(Object.keys(fieldLabels) as FieldKey[])
  )
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const toggleField = (field: FieldKey) => {
    setSelectedFields((prev) => {
      const next = new Set(prev)
      if (next.has(field)) {
        next.delete(field)
      } else {
        next.add(field)
      }
      return next
    })
  }

  const formatContent = () => {
    if (!post) return ''

    const parts: string[] = []
    if (selectedFields.has('title') && post.title) {
      parts.push(`## 標題\n${post.title}`)
    }

    if (selectedFields.has('subtitle') && post.subtitle) {
      parts.push(`## 副標\n${post.subtitle}`)
    }

    if (selectedFields.has('brief') && post.brief) {
      try {
        const plainBrief = convertFromRaw(post.brief).getPlainText(',')
        parts.push(`## 前言\n${plainBrief}`)
      } catch (err) {
        console.error('Error converting brief:', err)
      }
    }

    if (selectedFields.has('content') && post.content) {
      try {
        const plainContent = convertFromRaw(post.content).getPlainText(',')
        parts.push(`## 內文\n${plainContent}`)
      } catch (err) {
        console.error('Error converting content:', err)
      }
    }

    if (selectedFields.has('ogDescription') && post.ogDescription) {
      parts.push(`## og:description\n${post.ogDescription}`)
    }

    if (selectedFields.has('opening') && post.opening) {
      parts.push(`## 進入對話\n${post.opening}`)
    }

    if (
      selectedFields.has('postChoiceQuestions') &&
      post.postChoiceQuestions &&
      post.postChoiceQuestions.length > 0
    ) {
      parts.push('## 選擇題組')
      post.postChoiceQuestions.forEach((q, index: number) => {
        parts.push(`\n### ${index + 1}. ${q.title}`)
        if (q.options && Array.isArray(q.options)) {
          q.options.forEach((opt: ChoiceQuestionOption) => {
            const marker = opt.isCorrectAnswer ? '- [x]' : '- [ ]'
            parts.push(`${marker} ${opt.content || ''}`)
          })
        }
        if (q.reason) {
          parts.push(`\n**原因：** ${q.reason}`)
        }
      })
    }

    if (
      selectedFields.has('postEssayQuestions') &&
      post.postEssayQuestions &&
      post.postEssayQuestions.length > 0
    ) {
      parts.push('## 思辨題組')
      post.postEssayQuestions.forEach((q, index: number) => {
        parts.push(`\n### ${index + 1}. ${q.title}`)
        if (q.hint) {
          parts.push(`\n**提示：** ${q.hint}`)
        }
      })
    }

    return parts.join('\n\n')
  }

  const handleCopy = async () => {
    const content = formatContent()
    if (!content) {
      return
    }

    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (!post) {
    return (
      <FieldContainer>
        <FieldLabel>複製文章內容</FieldLabel>
        <Box marginTop="small">無法載入文章資料</Box>
      </FieldContainer>
    )
  }

  return (
    <FieldContainer>
      <FieldLabel>複製文章內容</FieldLabel>
      <FieldsContainer>
        {(Object.keys(fieldLabels) as FieldKey[]).map((field) => {
          const checkboxId = `copy-post-content-${field}`
          return (
            <CheckboxContainer key={field}>
              <CheckboxInput
                type="checkbox"
                checked={selectedFields.has(field)}
                onChange={() => toggleField(field)}
                id={checkboxId}
              />
              <CheckboxLabel>{fieldLabels[field]}</CheckboxLabel>
            </CheckboxContainer>
          )
        })}
      </FieldsContainer>
      <Box marginTop="medium">
        <Button onClick={handleCopy} disabled={selectedFields.size === 0}>
          <ClipboardIcon size="small" />
          {copied ? '已複製' : '複製選取的內容'}
        </Button>
      </Box>
    </FieldContainer>
  )
}
