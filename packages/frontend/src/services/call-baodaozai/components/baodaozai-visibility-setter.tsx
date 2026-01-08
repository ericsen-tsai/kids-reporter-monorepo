'use client'

import { useEffect } from 'react'

import { useCallBaodaozaiContext } from '../context'

function BaodaozaiVisibilitySetter({ show }: { show: boolean }) {
  const { baodaozaiProps } = useCallBaodaozaiContext()
  const { setHide } = baodaozaiProps
  useEffect(() => {
    setHide(!show)
  }, [show, setHide])
  return null
}

export default BaodaozaiVisibilitySetter
