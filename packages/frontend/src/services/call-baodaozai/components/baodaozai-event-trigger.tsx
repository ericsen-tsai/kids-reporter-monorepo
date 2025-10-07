'use client'

import { useCallback, useEffect, useRef } from 'react'
import { BaodaozaiAction } from '../types'
import { DialogBoxProps } from './dialog-box'
import { useCallBaodaozaiContext } from '../context'

export type BaodaozaiEventTriggerProps = {
  dialogState?: Partial<
    Omit<DialogBoxProps, 'onConfirm' | 'onCancel'> & {
      confirmAction: () => void
      cancelAction: () => void
    }
  >
  baodaozaiState?: Partial<{
    action: BaodaozaiAction
    isActive: boolean
    shouldTriggerStep: boolean
  }>
  once?: boolean
  disabled?: boolean
}

function BaodaozaiEventTrigger({
  dialogState: newDialogState = {},
  baodaozaiState: newBaodaozaiState = {},
  once = true,
  disabled = false,
}: BaodaozaiEventTriggerProps) {
  const {
    onDialogPropsChange,
    baodaozaiProps: { setAction, setIsActive, triggerStep },
  } = useCallBaodaozaiContext()
  const { action, isActive, shouldTriggerStep } = newBaodaozaiState
  const containerRef = useRef<HTMLDivElement>(null)

  const handleInView = useCallback(() => {
    onDialogPropsChange({ ...newDialogState })

    if (typeof isActive === 'boolean') {
      setIsActive(isActive)
    }

    if (typeof action === 'string') {
      setAction(action)
    }

    if (shouldTriggerStep) {
      triggerStep()
    }
  }, [
    onDialogPropsChange,
    newDialogState,
    isActive,
    action,
    shouldTriggerStep,
    setIsActive,
    setAction,
    triggerStep,
  ])

  useEffect(() => {
    const element = containerRef.current
    if (!element || disabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            handleInView()
            if (once) {
              observer.disconnect()
            }
          }
        })
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -10% 0px', // Trigger when element is 10% from bottom of viewport
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [handleInView, once, disabled])

  return <div ref={containerRef} />
}

export default BaodaozaiEventTrigger
