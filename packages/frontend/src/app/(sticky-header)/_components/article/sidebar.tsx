'use client'
import { ScrollLevel, useScrollLevel } from '@kids-reporter/routing-ui'
import Link from 'next/link'
import { useState } from 'react'

import { useArticleContext } from './article-context'
import styles from './sidebar.module.css'

const shareIcons = [
  {
    image: 'rpjr-icon-color-fb.svg',
    onClick: () => {
      const currentURL = window.location.href
      const location =
        'https://www.facebook.com/sharer/sharer.php?' +
        `u=${encodeURIComponent(currentURL)}`
      window.open(location, '_blank')
    },
  },
  {
    image: 'rpjr-icon-color-twitter.svg',
    onClick: () => {
      const currentURL = window.location.href
      const location =
        'https://twitter.com/intent/tweet?' +
        `url=${encodeURIComponent(currentURL)}&text=${encodeURIComponent(
          document.title + ' #報導者'
        )}`
      window.open(location, '_blank')
    },
  },
  {
    image: 'rpjr-icon-color-line.svg',
    onClick: () => {
      const currentURL = window.location.href
      const location = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
        currentURL
      )}`
      window.open(location, '_blank')
    },
  },
  {
    image: 'rpjr-icon-color-link.svg',
    onClick: () => {
      const currentURL = window.location.href
      navigator.clipboard.writeText(currentURL).then(() => {
        window.alert('已複製文章網址')
      })
    },
  },
]

type SidebarProp = {
  topicURL?: string
}

export const Sidebar = ({ topicURL }: SidebarProp) => {
  const { onFontSizeChange } = useArticleContext()

  return (
    <div
      style={{ zIndex: '900', marginTop: '-430px' }}
      className="sticky top-44 left-0 hidden w-16 lg:block"
    >
      <div className="relative flex flex-col items-center justify-center gap-4">
        {topicURL && (
          <div>
            <Link href={topicURL}>
              <img
                src="/assets/images/topic-breadcrumb-sidebar-icon.svg"
                loading="lazy"
              />
            </Link>
          </div>
        )}
        <div className="flex flex-col items-center justify-center rounded-3xl bg-gray-100 p-2 text-center">
          <span
            style={{ lineHeight: '160%', letterSpacing: '0.16em' }}
            className="flex text-sm font-normal text-gray-900"
          >
            分享
          </span>
          {shareIcons.map((icon, index) => {
            return (
              <button
                style={{ aspectRatio: '1/1' }}
                className="flex w-12 cursor-pointer appearance-none flex-col items-center justify-center border-none bg-transparent"
                key={`share-icon-${index}`}
                onClick={icon.onClick}
              >
                <img src={`/assets/images/${icon.image}`} loading="lazy" />
              </button>
            )
          })}
        </div>
        <div className="flex flex-col justify-center rounded-3xl bg-gray-100 p-2 text-center">
          <button
            style={{ aspectRatio: '1/1' }}
            className="flex w-12 cursor-pointer appearance-none flex-col items-center justify-center border-none bg-transparent"
            onClick={onFontSizeChange}
          >
            <img
              src={`/assets/images/rpjr-icon-color-text.svg`}
              loading="lazy"
            />
          </button>
          <button
            style={{ aspectRatio: '1/1' }}
            className="flex w-12 cursor-pointer appearance-none flex-col items-center justify-center border-none bg-transparent"
            onClick={() => window.print()}
          >
            <img
              src={`/assets/images/rpjr-icon-color-print.svg`}
              loading="lazy"
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export const MobileSidebar = ({ topicURL }: SidebarProp) => {
  const [isShareClicked, setIsShareClicked] = useState(false)
  const scrollLevel = useScrollLevel()
  const { onFontSizeChange } = useArticleContext()

  const onShareClick = () => {
    setIsShareClicked(!isShareClicked)
  }

  const shareBtnList = isShareClicked && (
    <div className="flex flex-row items-center gap-2 pt-2.5 pb-4">
      {shareIcons.map((icon, index) => {
        return (
          <button
            style={{ aspectRatio: '1/1' }}
            className="block w-12 cursor-pointer appearance-none border-none bg-transparent"
            key={`share-icon-${index}`}
            onClick={icon.onClick}
          >
            <img src={`/assets/images/${icon.image}`} loading="lazy" />
          </button>
        )
      })}
    </div>
  )

  const topicBtn = topicURL && (
    <div className="flex h-full flex-col items-center justify-between">
      <Link
        style={{ aspectRatio: '1/1' }}
        className="flex w-10 cursor-pointer appearance-none flex-col items-center justify-center border-none bg-transparent"
        href={topicURL}
      >
        <img
          src="/assets/images/topic-breadcrumb-sidebar-mobile-icon.svg"
          loading="lazy"
        />
      </Link>
      {scrollLevel === ScrollLevel.UP && (
        <span
          style={{ lineHeight: '160%', letterSpacing: '0.08em' }}
          className="text-center text-xs font-medium whitespace-nowrap text-gray-900 opacity-100"
        >
          前往專題
        </span>
      )}
    </div>
  )

  const shareBtn = (
    <div className="flex h-full flex-col items-center justify-between">
      <button
        style={{ aspectRatio: '1/1' }}
        className="flex w-10 cursor-pointer appearance-none flex-col items-center justify-center border-none bg-transparent"
        onClick={onShareClick}
      >
        <img src="/assets/images/mobile-sidebar-share.svg" loading="lazy" />
      </button>
      {scrollLevel === ScrollLevel.UP && (
        <span
          style={{ lineHeight: '160%', letterSpacing: '0.08em' }}
          className="text-center text-xs font-medium whitespace-nowrap text-gray-900 opacity-100"
        >
          分享文章
        </span>
      )}
    </div>
  )

  const fontBtn = (
    <div className="flex h-full flex-col items-center justify-between">
      <button
        style={{ aspectRatio: '1/1' }}
        className="flex w-10 cursor-pointer appearance-none flex-col items-center justify-center border-none bg-transparent"
        onClick={onFontSizeChange}
      >
        <img
          src="/assets/images/mobile-sidebar-change-font.svg"
          loading="lazy"
        />
      </button>
      {scrollLevel === ScrollLevel.UP && (
        <span
          style={{ lineHeight: '160%', letterSpacing: '0.08em' }}
          className="text-center text-xs font-medium whitespace-nowrap text-gray-900 opacity-100"
        >
          文字大小
        </span>
      )}
    </div>
  )

  return (
    <div
      style={{ zIndex: '900', width: 'inherit' }}
      className={`${
        scrollLevel === ScrollLevel.DOWN_HIDDEN ? styles.hidden : styles.sidebar
      } fixed bottom-2.5 flex-col items-center`}
    >
      <div className="relative flex flex-col items-center justify-center">
        {shareBtnList}
        <div
          style={{ boxShadow: 'rgba(35, 35, 35, 0.2) 0px 1px 8px 0px' }}
          className="flex max-h-16 flex-row items-center justify-around gap-10 rounded-full bg-white px-7 pb-2 text-center"
        >
          {topicBtn}
          {shareBtn}
          {fontBtn}
        </div>
      </div>
    </div>
  )
}
