import { useIsAtTop } from '@kids-reporter/routing-ui'
import { useEffect, useState } from 'react'

import BaodaozaiEventTrigger from '@/services/call-baodaozai/components/baodaozai-event-trigger'

type StartReadingBaodaozaiEventTriggerProps = {
  isSubmitted: boolean
  content: string
}

function StartReadingBaodaozaiEventTrigger({
  isSubmitted,
  content,
}: StartReadingBaodaozaiEventTriggerProps) {
  const isAtTop = useIsAtTop(35)
  const [isFirstRenderAtTop, setIsFirstRenderAtTop] = useState(isAtTop)

  useEffect(() => {
    if (!isAtTop && isFirstRenderAtTop) {
      setIsFirstRenderAtTop(false)
    }
  }, [isAtTop, isFirstRenderAtTop])

  return (
    <BaodaozaiEventTrigger
      id="show-start-reading"
      dialogState={{
        isOpen: true,
        confirmText: '開始閱讀',
        hideCancelButton: true,
        content,
      }}
      baodaozaiState={{
        isActive: true,
        action: 'speak',
      }}
      disabled={!isFirstRenderAtTop || isSubmitted}
    />
  )
}

export default StartReadingBaodaozaiEventTrigger
