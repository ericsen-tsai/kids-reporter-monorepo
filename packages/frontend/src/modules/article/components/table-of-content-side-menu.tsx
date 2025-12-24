'use client'
import { cn } from '@kids-reporter/routing-ui'
import { useCallback, useEffect, useRef, useState } from 'react'

import { STICKY_HEADER_HEIGHT } from '@/constants'

import {
  TABLET_OF_CONTENT_ANCHOR_PREFIX,
  TABLET_OF_CONTENT_BACK_TO_TOP_KEY,
  TABLET_OF_CONTENT_INDEX_PREFIX,
} from '../constants'

type TableOfContentSideMenuProps = {
  indexes: { key: string; label: string }[]
}

function makeAnchorIndexKey(key: string) {
  return `${TABLET_OF_CONTENT_INDEX_PREFIX}-${key}`
}

function makeAnchorKey(key: string) {
  return `${TABLET_OF_CONTENT_ANCHOR_PREFIX}-${key}`
}

function TableOfContentSideMenu({ indexes }: TableOfContentSideMenuProps) {
  const [currentActiveIndex, setCurrentActiveIndex] = useState<string | null>(
    makeAnchorKey(TABLET_OF_CONTENT_BACK_TO_TOP_KEY)
  )
  const [isExpanded, setIsExpanded] = useState(false)
  const anchorRefs = useRef<HTMLSpanElement[]>([])
  const menuContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    anchorRefs.current = indexes
      .map(({ key }) => {
        const element = document.querySelector(
          `#${makeAnchorKey(key)}`
        ) as HTMLSpanElement | null
        return element
      })
      .filter((anchor): anchor is HTMLSpanElement => anchor !== null)
  }, [indexes])

  const handleClickAnchorIndex = useCallback((key: string) => {
    const anchor = anchorRefs.current.find(
      (anchor) => anchor.id === makeAnchorKey(key)
    )
    if (!anchor) return
    const elementPosition = anchor.getBoundingClientRect().top
    const offsetPosition =
      elementPosition + window.scrollY - STICKY_HEADER_HEIGHT
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
  }, [])

  useEffect(() => {
    const anchors = anchorRefs.current

    if (anchors.length === 0) return

    const elementToKeyMap = new Map<HTMLElement, string>()
    anchors.forEach((anchor) => {
      const key = anchor.id.replace(`${TABLET_OF_CONTENT_ANCHOR_PREFIX}-`, '')
      elementToKeyMap.set(anchor, key)
    })

    const observerOptions = {
      root: null,
      rootMargin: `-${STICKY_HEADER_HEIGHT + 20}px 0px -80% 0px`,
      threshold: [0, 0.1, 0.5, 1],
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting)

      if (visibleEntries.length === 0) {
        if (window.scrollY < STICKY_HEADER_HEIGHT) {
          setCurrentActiveIndex(
            makeAnchorKey(TABLET_OF_CONTENT_BACK_TO_TOP_KEY)
          )
        }
        return
      }

      const sortedEntries = visibleEntries.sort((a, b) => {
        const aTop = a.boundingClientRect.top
        const bTop = b.boundingClientRect.top
        const threshold = STICKY_HEADER_HEIGHT + 50

        // If both are near the top, prefer the one closer to the threshold
        if (aTop < threshold && bTop < threshold) {
          return Math.abs(aTop - threshold) - Math.abs(bTop - threshold)
        }

        // If one is above threshold and one is below, prefer the one above
        if (aTop < threshold && bTop >= threshold) return -1
        if (aTop >= threshold && bTop < threshold) return 1

        // Both below threshold, prefer the one closer to the top
        return aTop - bTop
      })

      const mostVisibleEntry = sortedEntries[0]
      if (!mostVisibleEntry) return
      const element = mostVisibleEntry.target as HTMLElement
      const key = elementToKeyMap.get(element)
      if (!key) return
      setCurrentActiveIndex(makeAnchorKey(key))
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    anchors.forEach((anchor) => {
      observer.observe(anchor)
    })

    const handleScroll = () => {
      if (window.scrollY < STICKY_HEADER_HEIGHT) {
        setCurrentActiveIndex(makeAnchorKey(TABLET_OF_CONTENT_BACK_TO_TOP_KEY))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [indexes])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target as Node) &&
        isExpanded
      ) {
        setIsExpanded(false)
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExpanded])

  if (indexes.length === 0) {
    return null
  }

  return (
    <nav
      ref={menuContainerRef}
      className="fixed top-0 left-0 z-1002 print:hidden"
      aria-label="文章目錄"
    >
      <button
        type="button"
        onClick={() => {
          setIsExpanded(!isExpanded)
        }}
        aria-label={isExpanded ? '關閉目錄' : '開啟目錄'}
        aria-expanded={isExpanded}
        className={cn(
          'fixed top-[144px] left-0 w-8 cursor-pointer transition-transform delay-100 duration-100 ease-in-out',
          isExpanded ? 'translate-x-[200px]' : 'translate-x-0'
        )}
      >
        <div
          className={cn(
            'absolute top-0 left-0 flex h-24 w-8 flex-col items-center justify-center gap-2.5 rounded-r-[20px] bg-neutral-black/8 px-[9px] py-[26px] text-sm leading-[1.6] text-neutral-700 backdrop-blur-xs transition-all duration-100 ease-in-out hover:text-red-400',
            isExpanded && 'bg-neutral-200'
          )}
        >
          索
          <br />引
        </div>
      </button>
      <div
        role="list"
        className={cn(
          'fixed top-0 left-0 flex h-screen w-[200px] flex-col justify-center gap-2 bg-neutral-100 px-5 py-6 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.2)] transition-transform delay-100 duration-100 ease-in-out',
          isExpanded ? 'translate-x-0' : '-translate-x-[200px]'
        )}
      >
        <button
          type="button"
          role="listitem"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          aria-current={
            currentActiveIndex ===
            makeAnchorKey(TABLET_OF_CONTENT_BACK_TO_TOP_KEY)
              ? 'true'
              : undefined
          }
          className={cn(
            'w-full cursor-pointer rounded bg-transparent px-1 py-[1px] text-start prose-p2 break-words text-neutral-600 transition-all duration-100 ease-in-out',
            currentActiveIndex ===
              makeAnchorKey(TABLET_OF_CONTENT_BACK_TO_TOP_KEY) &&
              'font-bold text-red-400'
          )}
        >
          回到置頂
        </button>
        {indexes.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="listitem"
            id={makeAnchorIndexKey(key)}
            onClick={() => {
              handleClickAnchorIndex(key)
            }}
            aria-current={
              currentActiveIndex === makeAnchorKey(key) ? 'true' : undefined
            }
            className={cn(
              'w-full cursor-pointer rounded bg-transparent px-1 py-[1px] text-start prose-p2 break-words text-neutral-600 transition-all duration-100 ease-in-out',
              currentActiveIndex === makeAnchorKey(key) &&
                'font-bold text-red-400'
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default TableOfContentSideMenu
