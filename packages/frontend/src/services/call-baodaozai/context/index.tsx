'use client'

import { useContext, useState, useCallback, useMemo } from 'react'
import { createContext } from 'react'
import {
  ACTION_KEY,
  ACTIVE_KEY,
  DIALOG_DEFAULT_CANCEL_TEXT,
  DIALOG_DEFAULT_CONFIRM_TEXT,
  DIALOG_DEFAULT_CONTENT,
  STATE_MACHINE_NAME,
  STEP_KEY,
  VIEW_MODEL_NAME,
} from './constants'
import {
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceBoolean,
  useViewModelInstanceEnum,
  useViewModelInstanceTrigger,
} from '@rive-app/react-webgl2'
import { BaodaozaiAction } from '../types'
import { cn } from '@kids-reporter/routing-ui'
import { DialogBoxProps } from '../components/dialog-box'

export type CallBaodaozaiProps = {
  dialogWithActionProps: Omit<DialogBoxProps, 'onConfirm' | 'onCancel'> & {
    confirmAction: () => void
    cancelAction: () => void
  }
  baodaozaiProps: {
    action: BaodaozaiAction
    isActive: boolean
    setIsActive: (isActive: boolean) => void
    setAction: (action: BaodaozaiAction) => void
    triggerStep: () => void
    toggleActive: () => void
  }
  renderBaodaozai: React.ReactNode
}

export type CallBaodaozaiState = {
  onDialogPropsChange: (
    dialogProps: Partial<CallBaodaozaiProps['dialogWithActionProps']>
  ) => void
} & CallBaodaozaiProps

const CallBaodaozaiContext = createContext<CallBaodaozaiState | null>(null)

const BAODAOZAI_SRC = '../baodaozai-db.riv'

export function CallBaodaozaiProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { RiveComponent, rive } = useRive({
    src: BAODAOZAI_SRC,
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
  })

  const viewModel = useViewModel(rive, { name: VIEW_MODEL_NAME })
  const viewModelInstance = useViewModelInstance(viewModel, { rive })

  const { value: isActive, setValue: setIsActive } =
    useViewModelInstanceBoolean(ACTIVE_KEY, viewModelInstance)

  const { value: action, setValue: setAction } = useViewModelInstanceEnum(
    ACTION_KEY,
    viewModelInstance
  )

  const { trigger: triggerStep } = useViewModelInstanceTrigger(
    STEP_KEY,
    viewModelInstance
  )

  const [dialogWithActionProps, setDialogWithActionProps] = useState<
    CallBaodaozaiProps['dialogWithActionProps']
  >({
    content: DIALOG_DEFAULT_CONTENT,
    confirmText: DIALOG_DEFAULT_CONFIRM_TEXT,
    cancelText: DIALOG_DEFAULT_CANCEL_TEXT,
    hideCancelButton: false,
    isOpen: false,
    confirmAction: () => {
      console.log('onConfirm')
    },
    cancelAction: () => {
      console.log('onCancel')
    },
  })

  const onDialogPropsChange = useCallback(
    (newDialogProps: Partial<CallBaodaozaiProps['dialogWithActionProps']>) => {
      setDialogWithActionProps((prev) => ({ ...prev, ...newDialogProps }))
    },
    []
  )

  const toggleActive = useCallback(() => {
    setIsActive(!isActive)
  }, [isActive, setIsActive])

  const baodaozaiProps = useMemo(
    () => ({
      action: action as BaodaozaiAction,
      isActive: isActive ?? false,
      setIsActive,
      setAction,
      triggerStep,
      toggleActive,
    }),
    [action, isActive, setIsActive, setAction, triggerStep, toggleActive]
  )

  const renderBaodaozai = useMemo(() => {
    return (
      <div
        className={cn(
          'transition-width transition-height duration-1000',
          isActive ? 'h-auto w-25' : 'h-30 w-30 tablet:h-32 tablet:w-32'
        )}
      >
        <RiveComponent />
      </div>
    )
  }, [isActive, RiveComponent])

  const contextValue: CallBaodaozaiState = useMemo(
    () => ({
      dialogWithActionProps,
      baodaozaiProps,
      renderBaodaozai,
      onDialogPropsChange,
    }),
    [
      dialogWithActionProps,
      baodaozaiProps,
      renderBaodaozai,
      onDialogPropsChange,
    ]
  )

  return (
    <CallBaodaozaiContext.Provider value={contextValue}>
      {children}
    </CallBaodaozaiContext.Provider>
  )
}

export function useCallBaodaozaiContext(): CallBaodaozaiState {
  const context = useContext(CallBaodaozaiContext)
  if (!context)
    throw new Error('Missing CallBaodaozaiContext.Provider in the tree')
  return context
}
