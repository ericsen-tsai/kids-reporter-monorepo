'use client'

import { memo, useCallback, useEffect, useRef } from 'react'

import { useCallBaodaozaiContext } from '../context'
import { BaodaozaiAction, BaodaozaiActionSetter } from '../types'
import { DialogBoxProps } from './dialog-box'

export type BaodaozaiEventTriggerProps = {
  dialogState?: Partial<
    Omit<DialogBoxProps, 'onConfirm' | 'onCancel'> & {
      confirmAction: BaodaozaiActionSetter
      cancelAction: BaodaozaiActionSetter
    }
  >
  baodaozaiState?: Partial<{
    action: BaodaozaiAction
    isActive: boolean
    shouldTriggerStep: boolean
  }>
  once?: boolean
  disabled?: boolean
  id?: string
}

function BaodaozaiEventTrigger({
  dialogState: newDialogState = {},
  baodaozaiState: newBaodaozaiState = {},
  once = true,
  disabled = false,
  id,
}: BaodaozaiEventTriggerProps) {
  const {
    onDialogPropsChange,
    baodaozaiProps: { setAction, setIsActive, triggerStep, isInitialized },
  } = useCallBaodaozaiContext()
  const { action, isActive, shouldTriggerStep } = newBaodaozaiState
  const containerRef = useRef<HTMLDivElement>(null)
  const triggeredOnceRef = useRef(false)

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
    if (!element || disabled || triggeredOnceRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            handleInView()
            if (once) {
              observer.disconnect()
              triggeredOnceRef.current = true
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

  return isInitialized ? <div ref={containerRef} id={id} /> : null
}

export default memo(BaodaozaiEventTrigger)
