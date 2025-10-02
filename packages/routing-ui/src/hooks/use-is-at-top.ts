'use client'
import { useState, useEffect } from 'react'

const useIsAtTop = (threshold = 35) => {
  const [isAtTop, setIsAtTop] = useState(true)

  useEffect(() => {
    const checkIsAtTop = () => {
      setIsAtTop(window.scrollY <= threshold)
    }

    checkIsAtTop()
    window.addEventListener('scroll', checkIsAtTop, { passive: true })

    return () => {
      window.removeEventListener('scroll', checkIsAtTop)
    }
  }, [threshold])

  return isAtTop
}

export default useIsAtTop
