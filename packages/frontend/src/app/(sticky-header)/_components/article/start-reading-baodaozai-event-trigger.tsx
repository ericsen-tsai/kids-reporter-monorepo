import { useIsAtTop } from '@kids-reporter/routing-ui'
import { useEffect, useState } from 'react'

import { BaodaozaiEventTrigger } from '@/services/call-baodaozai'

type StartReadingBaodaozaiEventTriggerProps = {
  isSubmitted: boolean
}

function StartReadingBaodaozaiEventTrigger({
  isSubmitted,
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
        // TODO: get content from backend
        // content: post?.intro
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
