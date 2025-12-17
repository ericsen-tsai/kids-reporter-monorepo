'use client'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

type FeatureIntroDialogContextType = {
  isDialogOpen: boolean
  openDialog: () => void
  closeDialog: () => void
}

const FeatureIntroDialogContext = createContext<
  FeatureIntroDialogContextType | undefined
>(undefined)

export function FeatureIntroDialogProvider({
  children,
}: {
  children: ReactNode
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const openDialog = useCallback(() => setIsDialogOpen(true), [])
  const closeDialog = useCallback(() => setIsDialogOpen(false), [])

  const contextValue = useMemo(
    () => ({
      isDialogOpen,
      openDialog,
      closeDialog,
    }),
    [isDialogOpen, openDialog, closeDialog]
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
