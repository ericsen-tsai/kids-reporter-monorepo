'use client'

import { useIsAtTop } from '@kids-reporter/routing-ui'
import { ComponentProps, useEffect, useMemo, useState } from 'react'

import BaodaozaiEventTrigger from '@/services/call-baodaozai/components/baodaozai-event-trigger'

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
}: {
  content?: string
}): Record<EventId, EventConfig> {
  return {
    'show-intro': {
      dialogState: {
        isOpen: true,
        content: content || '',
        hideCancelButton: true,
        confirmText: '知道了',
        confirmAction: () => {},
      },
      baodaozaiState: {
        isActive: true,
        action: 'speak',
      },
    },
    'hide-intro': {
      dialogState: {
        isOpen: false,
        hideCancelButton: true,
        confirmText: '知道了',
        confirmAction: () => {},
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

  useEffect(() => {
    if (!isAtTop && isFirstRenderAtTop) {
      setIsFirstRenderAtTop(false)
    }
  }, [isAtTop, isFirstRenderAtTop])

  const eventConfig = useMemo(() => {
    const config = createBaodaozaiEventConfig({ content })
    return config[id]
  }, [id, content])

  if (!eventConfig) {
    console.warn(
      `No configuration found for baodaozai event trigger with id: ${id}`
    )
    return null
  }

  return (
    <BaodaozaiEventTrigger
      id={id}
      disabled={id === 'show-intro' && !isFirstRenderAtTop}
      dialogState={eventConfig.dialogState}
      baodaozaiState={eventConfig.baodaozaiState}
    />
  )
}

export default AllSiteBaodaozaiEventTrigger
