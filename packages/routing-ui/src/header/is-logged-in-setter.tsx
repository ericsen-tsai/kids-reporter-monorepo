import { useEffect } from 'react'

import { useHeaderContext } from './header-context'

type IsLoggedInSetterProps = {
  isLoggedIn: boolean
  loginUrl: string
}

function IsLoggedInSetter({ isLoggedIn, loginUrl }: IsLoggedInSetterProps) {
  const context = useHeaderContext()
  const setIsLoggedIn = context?.setIsLoggedIn
  const setLoginUrl = context?.setLoginUrl

  useEffect(() => {
    setIsLoggedIn?.(isLoggedIn)
    setLoginUrl?.(loginUrl)
    return () => {
      setIsLoggedIn?.(false)
      setLoginUrl?.(undefined)
    }
  }, [isLoggedIn, setIsLoggedIn, loginUrl, setLoginUrl])

  return null
}

export default IsLoggedInSetter
