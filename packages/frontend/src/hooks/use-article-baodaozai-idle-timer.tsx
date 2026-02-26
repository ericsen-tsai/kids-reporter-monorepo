import { useMemo } from 'react'

import useIdleTimer from '@/hooks/use-idle-timer'
import { useCallBaodaozaiContext } from '@/services/call-baodaozai'

function useArticleBaodaozaiIdleTimer() {
  const {
    baodaozaiProps: { setAction, setIsIdelReadStoned, isInitialized, hide },
  } = useCallBaodaozaiContext()

  const idleTimerProps = useMemo(
    () => ({
      idleCallback: async () => {
        setAction('idel-read')
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsIdelReadStoned(true)
      },
      interactCallback: () => {
        setIsIdelReadStoned(false)
      },
      disabled: !isInitialized || hide,
    }),
    [setAction, setIsIdelReadStoned, isInitialized, hide]
  )

  return useIdleTimer(idleTimerProps)
}

export default useArticleBaodaozaiIdleTimer
