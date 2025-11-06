import { useEffect } from 'react'

import { useHeaderContext } from './header-context'

type IsLoggedInSetterProps = {
  isLoggedIn: boolean
}

function IsLoggedInSetter({ isLoggedIn }: IsLoggedInSetterProps) {
  const context = useHeaderContext()
  const setIsLoggedIn = context?.setIsLoggedIn

  useEffect(() => {
    setIsLoggedIn?.(isLoggedIn)

    return () => setIsLoggedIn?.(false)
  }, [isLoggedIn, setIsLoggedIn])

  return null
}

export default IsLoggedInSetter
