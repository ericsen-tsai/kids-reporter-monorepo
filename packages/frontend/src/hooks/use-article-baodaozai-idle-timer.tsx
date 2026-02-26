import { useMemo } from 'react'

import useIdleTimer from '@/hooks/use-idle-timer'
import { useCallBaodaozaiContext } from '@/services/call-baodaozai'
import { DEFAULT_ANIMATION_DELAY } from '@/services/call-baodaozai/context/constants'

function useArticleBaodaozaiIdleTimer() {
  const {
    baodaozaiProps: { setAction, setIsIdelReadStoned, isInitialized, hide },
  } = useCallBaodaozaiContext()

  const idleTimerProps = useMemo(() => {
    let idleGeneration = 0
    const idleCallback = async () => {
      const currentGeneration = ++idleGeneration
      setAction('idel-read')
      await new Promise((resolve) =>
        setTimeout(resolve, DEFAULT_ANIMATION_DELAY)
      )
      if (currentGeneration === idleGeneration) {
        setIsIdelReadStoned(true)
      }
    }
    const interactCallback = () => {
      idleGeneration++
      setIsIdelReadStoned(false)
    }
    return {
      idleCallback,
      interactCallback,
      disabled: !isInitialized || hide,
    }
  }, [setAction, setIsIdelReadStoned, isInitialized, hide])

  return useIdleTimer(idleTimerProps)
}

export default useArticleBaodaozaiIdleTimer
