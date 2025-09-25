'use client'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

type HeaderContextType = {
  postTitle?: string
  setPostTitle: (title?: string) => void
  isMenuOpen: boolean
  openMenu: () => void
  closeMenu: () => void
  keywords: string[]
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined)

export function HeaderProvider({
  children,
  keywords,
}: {
  children: ReactNode
  keywords: string[]
}) {
  const [postTitle, setPostTitle] = useState<string | undefined>(undefined)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const openMenu = useCallback(() => setIsMenuOpen(true), [])
  const closeMenu = useCallback(() => setIsMenuOpen(false), [])

  const contextValue = useMemo(
    () => ({
      postTitle,
      setPostTitle,
      isMenuOpen,
      openMenu,
      closeMenu,
      keywords,
    }),
    [postTitle, setPostTitle, isMenuOpen, openMenu, closeMenu, keywords]
  )

  return (
    <HeaderContext.Provider value={contextValue}>
      {children}
    </HeaderContext.Provider>
  )
}

export function useHeaderContext() {
  const context = useContext(HeaderContext)
  return context
}
