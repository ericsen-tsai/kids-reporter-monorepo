'use client'
import throttle from 'lodash/throttle'
import { useCallback, useEffect, useMemo, useRef } from 'react'

import {
  QAModalEvent as ScrollUpBaodaozaiEventTriggerEvent,
  useCallBaodaozaiContext,
} from '@/services/call-baodaozai'

export type ScrollUpBaodaozaiEventTriggerProps = {
  onScrollUp: (events: ScrollUpBaodaozaiEventTriggerEvent) => void
}

const SCROLL_UP_THRESHOLD = 100

function ScrollUpBaodaozaiEventTrigger({
  onScrollUp,
}: ScrollUpBaodaozaiEventTriggerProps) {
  const { onDialogPropsChange, baodaozaiProps } = useCallBaodaozaiContext()
  const { setHide, setIsActive, setAction } = baodaozaiProps
  const lastScrollY = useRef(0)
  const scrollUpStartY = useRef(0)
  const isScrollingUp = useRef(false)

  const resetScrollTracking = useCallback(() => {
    isScrollingUp.current = false
    scrollUpStartY.current = lastScrollY.current
  }, [])

  const triggerScrollUpEvent = useCallback(() => {
    onScrollUp({
      setHide,
      setIsActive,
      setAction,
      onDialogPropsChange,
    })
    resetScrollTracking()
  }, [
    onScrollUp,
    setHide,
    setIsActive,
    setAction,
    onDialogPropsChange,
    resetScrollTracking,
  ])

  const throttledTriggerScrollUpEvent = useMemo(
    () => throttle(triggerScrollUpEvent, 100),
    [triggerScrollUpEvent]
  )

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    const scrollingUp = currentScrollY < lastScrollY.current

    if (scrollingUp) {
      if (!isScrollingUp.current) {
        scrollUpStartY.current = lastScrollY.current
        isScrollingUp.current = true
      }

      const scrollUpDistance = scrollUpStartY.current - currentScrollY
      if (scrollUpDistance >= SCROLL_UP_THRESHOLD) {
        throttledTriggerScrollUpEvent()
      }
    }

    if (!scrollingUp) {
      resetScrollTracking()
    }

    lastScrollY.current = currentScrollY
  }, [throttledTriggerScrollUpEvent, resetScrollTracking])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return null
}

export default ScrollUpBaodaozaiEventTrigger
