import { useEffect } from 'react'

import { useHeaderContext } from './header-context'

type MobileBackButtonHrefSetterProps = {
  href?: string
}

function MobileBackButtonHrefSetter({ href }: MobileBackButtonHrefSetterProps) {
  const context = useHeaderContext()
  const setMobileBackButtonHref = context?.setMobileBackButtonHref

  useEffect(() => {
    setMobileBackButtonHref?.(href)

    return () => setMobileBackButtonHref?.(undefined)
  }, [href, setMobileBackButtonHref])

  return null
}

export default MobileBackButtonHrefSetter
