'use client'

import { cn } from '@kids-reporter/routing-ui'
import { type RefObject, useCallback } from 'react'

import { ArrowLeft, ArrowRight } from '@/icons/arrow'
import { BackToTopIcon } from '@/icons/miscellaneous'

type NavBarProps = {
  scrollContainerRef: RefObject<HTMLDivElement | null>
  onScrollToTop: () => void
  showNavBar: boolean
}

const CARD_DATA_INDEX_ATTR = 'data-card-index'

const getScrollAmount = (container: HTMLDivElement): number => {
  const firstCard = container.querySelector<HTMLElement>(
    `[${CARD_DATA_INDEX_ATTR}="0"]`
  )
  if (!firstCard) return 0

  const cardWidth = firstCard.offsetWidth
  const gap =
    parseInt(window.getComputedStyle(container).gap.replace('px', ''), 10) || 24
  return cardWidth + gap
}

function NavBar({
  scrollContainerRef,
  onScrollToTop,
  showNavBar,
}: NavBarProps) {
  const scrollLeft = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const scrollAmount = getScrollAmount(container)
    if (scrollAmount > 0) {
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      })
    }
  }, [scrollContainerRef])

  const scrollRight = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const scrollAmount = getScrollAmount(container)
    if (scrollAmount > 0) {
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      })
    }
  }, [scrollContainerRef])

  return (
    <div
      className={cn(
        'sticky bottom-0 left-0 z-nav opacity-0 transition-opacity duration-200',
        showNavBar && 'opacity-100'
      )}
    >
      <div
        className="absolute bottom-8 left-[50vw] hidden w-min -translate-x-1/2 items-center rounded-full bg-white p-2 shadow-md desktop:inline-flex"
        role="group"
        aria-label="捲動導覽"
      >
        <button
          type="button"
          onClick={scrollLeft}
          className="flex h-7 w-[50px] cursor-pointer items-center justify-center text-neutral-400 transition-colors duration-200 hover:text-neutral-600"
          aria-label="向左捲動"
        >
          <ArrowLeft />
        </button>
        <button
          type="button"
          onClick={scrollRight}
          className="flex h-7 w-[50px] cursor-pointer items-center justify-center text-neutral-400 transition-colors duration-200 hover:text-neutral-600"
          aria-label="向右捲動"
        >
          <ArrowRight />
        </button>
      </div>
      <button
        type="button"
        onClick={onScrollToTop}
        className="absolute bottom-8 left-[100vw] flex h-11 w-11 -translate-x-[calc(100%+24px)] cursor-pointer items-center justify-center rounded-full bg-white text-neutral-400 shadow-md transition-colors duration-200 hover:text-neutral-600 tablet:-translate-x-[calc(100%+32px)]"
        aria-label="回到頂部"
      >
        <BackToTopIcon />
      </button>
    </div>
  )
}

export default NavBar
