'use client'

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

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
  suppressAfterAction?: boolean
}

function BaodaozaiEventTrigger({
  dialogState: newDialogState = {},
  baodaozaiState: newBaodaozaiState = {},
  once = true,
  disabled = false,
  suppressAfterAction = true,
  id,
}: BaodaozaiEventTriggerProps) {
  const {
    onDialogPropsChange,
    baodaozaiProps: { setAction, setIsActive, triggerStep, isInitialized },
  } = useCallBaodaozaiContext()
  const { action, isActive, shouldTriggerStep } = newBaodaozaiState
  const containerRef = useRef<HTMLDivElement>(null)
  const triggeredOnceRef = useRef(false)

  const shouldSuppress = useRef(false)

  const newDialogStateWithSuppress = useMemo(() => {
    const { confirmAction, cancelAction, ...rest } = newDialogState
    return {
      ...rest,
      ...(confirmAction
        ? {
            confirmAction: (args: Parameters<BaodaozaiActionSetter>[0]) => {
              shouldSuppress.current = true
              confirmAction(args)
            },
          }
        : {}),
      ...(cancelAction
        ? {
            cancelAction: (args: Parameters<BaodaozaiActionSetter>[0]) => {
              shouldSuppress.current = true
              cancelAction(args)
            },
          }
        : {}),
    }
  }, [newDialogState])

  const handleInView = useCallback(() => {
    onDialogPropsChange(
      suppressAfterAction
        ? { ...newDialogStateWithSuppress }
        : { ...newDialogState }
    )

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
    suppressAfterAction,
    newDialogStateWithSuppress,
  ])

  const [prevDisabled, setPrevDisabled] = useState(disabled)

  useEffect(() => {
    if (prevDisabled !== disabled) {
      triggeredOnceRef.current = false
      setPrevDisabled(disabled)
    }
  }, [disabled, prevDisabled])

  useEffect(() => {
    const element = containerRef.current
    if (
      !element ||
      disabled ||
      triggeredOnceRef.current ||
      shouldSuppress.current
    )
      return

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
