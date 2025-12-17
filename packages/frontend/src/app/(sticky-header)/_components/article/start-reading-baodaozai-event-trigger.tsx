'use client'
import { useIsAtTop } from '@kids-reporter/routing-ui'
import { useEffect, useMemo, useState } from 'react'

import { useFeatureIntroDialogContext } from '@/services/feature-intro'

import ArticleBaodaozaiEventTrigger from './article-baodaozai-event-trigger'

type StartReadingBaodaozaiEventTriggerProps = {
  content: string
}

function StartReadingBaodaozaiEventTrigger({
  content,
}: StartReadingBaodaozaiEventTriggerProps) {
  const isAtTop = useIsAtTop(35)
  const [isFirstRenderAtTop, setIsFirstRenderAtTop] = useState(isAtTop)
  const { canShowBaodaozai } = useFeatureIntroDialogContext()

  const disabled = useMemo(() => {
    if (!canShowBaodaozai) {
      return true
    }
    return !isFirstRenderAtTop
  }, [canShowBaodaozai, isFirstRenderAtTop])

  useEffect(() => {
    if (!isAtTop && isFirstRenderAtTop) {
      setIsFirstRenderAtTop(false)
    }
  }, [isAtTop, isFirstRenderAtTop])

  return (
    <ArticleBaodaozaiEventTrigger
      id="show-start-reading"
      disabled={disabled}
      startReadingContent={content}
    />
  )
}

export default StartReadingBaodaozaiEventTrigger
