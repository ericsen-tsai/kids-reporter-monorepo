'use client'

import { createContext, useContext, ReactNode, useState } from 'react'

type HeaderContextType = {
  postTitle?: string
  setPostTitle: (title?: string) => void
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined)

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [postTitle, setPostTitle] = useState<string | undefined>(undefined)

  return (
    <HeaderContext.Provider value={{ postTitle, setPostTitle }}>
      {children}
    </HeaderContext.Provider>
  )
}

export function useHeaderContext() {
  const context = useContext(HeaderContext)
  return context
}
