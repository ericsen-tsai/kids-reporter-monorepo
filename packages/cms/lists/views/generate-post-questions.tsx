import React, { useState } from 'react'
import { FieldContainer, FieldLabel } from '@keystone-ui/fields'
import { Button } from '@keystone-ui/button'
import { controller } from '@keystone-6/core/fields/types/virtual/views'
import { FieldProps } from '@keystone-6/core/types'
import { gql, useMutation } from '@keystone-6/core/admin-ui/apollo'
import { Box } from '@keystone-ui/core'

const GENERATE_QUESTIONS = gql`
  mutation GeneratePostQuestions($postId: ID!) {
    generatePostQuestions(postId: $postId)
  }
`

export const Field = ({ value }: FieldProps<typeof controller>) => {
  const [message, setMessage] = useState<string | null>(null)
  const [mutate, { loading }] = useMutation(GENERATE_QUESTIONS)

  const handleClick = async () => {
    if (!value?.postId) {
      return
    }

    setMessage(null)

    try {
      await mutate({ variables: { postId: value.postId } })
      setMessage('已完成檢查與生成（請重新整理頁面看最新的內容）。')
    } catch (err) {
      setMessage('發生錯誤，請稍後再試。')

      console.error(err)
    }
  }

  return (
    <FieldContainer>
      <FieldLabel>AI 自動產生題組</FieldLabel>
      <Box marginTop="small">
        <Button onClick={handleClick} disabled={loading}>
          {loading ? '處理中...' : '檢查並自動產生題組'}
        </Button>
      </Box>
      {message && <Box marginTop="small">{message}</Box>}
    </FieldContainer>
  )
}
