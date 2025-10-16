'use client'
import { useEffect } from 'react'

import { BACK_TO_TOP_ELEMENT_ID } from '@/constants'

const topDetectorID = 'top-detector'

export const TopDetector = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const backToTopElement = document.querySelector(
          `#${BACK_TO_TOP_ELEMENT_ID}`
        )
        if (entry.isIntersecting) {
          backToTopElement?.classList?.add('hidden')
        } else {
          backToTopElement?.classList?.remove('hidden')
        }
      },
      {
        root: null,
        threshold: 0,
      }
    )

    observer.observe(document.querySelector(`#${topDetectorID}`) as Element)
  }, [])

  return <div id={topDetectorID}></div>
}

export default TopDetector
