'use client'

import { useIsAtTop } from '@kids-reporter/routing-ui'
import { ComponentProps, useEffect, useMemo, useState } from 'react'

import BaodaozaiEventTrigger from '@/services/call-baodaozai/components/baodaozai-event-trigger'
import { useFeatureIntroDialogContext } from '@/services/feature-intro'

type EventId = 'show-intro' | 'hide-intro'

type EventConfig = Pick<
  ComponentProps<typeof BaodaozaiEventTrigger>,
  'dialogState' | 'baodaozaiState'
>

type AllSiteBaodaozaiEventTriggerProps = {
  id: EventId
  content?: string
}

function createBaodaozaiEventConfig({
  content,
  confirmAction,
}: {
  confirmAction: () => void
  content?: string
}): Record<EventId, EventConfig> {
  return {
    'show-intro': {
      dialogState: {
        isOpen: true,
        content: content || '',
        confirmText: '開始介紹',
        confirmAction,
        cancelText: '跳過',
      },
      baodaozaiState: {
        isActive: true,
        action: 'speak',
      },
    },
    'hide-intro': {
      dialogState: {
        isOpen: false,
        confirmText: '開始介紹',
        confirmAction,
        cancelText: '跳過',
      },
      baodaozaiState: {
        isActive: false,
        action: 'none',
      },
    },
  }
}

function AllSiteBaodaozaiEventTrigger({
  id,
  content,
}: AllSiteBaodaozaiEventTriggerProps) {
  const isAtTop = useIsAtTop(35)
  const [isFirstRenderAtTop, setIsFirstRenderAtTop] = useState(isAtTop)
  const { openDialog: openFeatureIntroDialog } = useFeatureIntroDialogContext()
  useEffect(() => {
    if (!isAtTop && isFirstRenderAtTop) {
      setIsFirstRenderAtTop(false)
    }
  }, [isAtTop, isFirstRenderAtTop])

  const eventConfig = useMemo(() => {
    const config = createBaodaozaiEventConfig({
      content,
      confirmAction: openFeatureIntroDialog,
    })
    return config[id]
  }, [id, content, openFeatureIntroDialog])

  const { canShowBaodaozai } = useFeatureIntroDialogContext()

  const disabled = useMemo(() => {
    if (!canShowBaodaozai) {
      return true
    }
    return id === 'show-intro' && !isFirstRenderAtTop
  }, [canShowBaodaozai, id, isFirstRenderAtTop])

  if (!eventConfig) {
    console.warn(
      `No configuration found for baodaozai event trigger with id: ${id}`
    )
    return null
  }

  return (
    <BaodaozaiEventTrigger
      id={id}
      disabled={disabled}
      once={false}
      {...eventConfig}
    />
  )
}

export default AllSiteBaodaozaiEventTrigger
