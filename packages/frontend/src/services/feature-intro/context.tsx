'use client'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

import { FEATURE_INTRO_DIALOG_SEEN_KEY } from './constants'

type FeatureIntroDialogContextType = {
  isDialogOpen: boolean | undefined
  openDialog: () => void
  closeDialog: () => void
  isFinishedIntro: boolean
}

const FeatureIntroDialogContext = createContext<
  FeatureIntroDialogContextType | undefined
>(undefined)

export function FeatureIntroDialogProvider({
  children,
}: {
  children: ReactNode
}) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean | undefined>(
    undefined
  )
  const openDialog = useCallback(() => setIsDialogOpen(true), [])
  const closeDialog = useCallback(() => setIsDialogOpen(false), [])

  const isFinishedIntro = useMemo(() => {
    return (
      (isDialogOpen !== undefined && !isDialogOpen) ||
      (typeof window !== 'undefined' &&
        typeof localStorage !== 'undefined' &&
        localStorage.getItem(FEATURE_INTRO_DIALOG_SEEN_KEY) === 'true')
    )
  }, [isDialogOpen])

  const contextValue = useMemo(
    () => ({
      isDialogOpen,
      openDialog,
      closeDialog,
      isFinishedIntro,
    }),
    [isDialogOpen, openDialog, closeDialog, isFinishedIntro]
  )

  return (
    <FeatureIntroDialogContext.Provider value={contextValue}>
      {children}
    </FeatureIntroDialogContext.Provider>
  )
}

export function useFeatureIntroDialogContext() {
  const context = useContext(FeatureIntroDialogContext)
  if (!context)
    throw new Error('Missing FeatureIntroDialogContext.Provider in the tree')
  return context
}
