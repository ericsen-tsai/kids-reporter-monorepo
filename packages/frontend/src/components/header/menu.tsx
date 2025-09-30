'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/utils/cn'
import {
  MENU_ITEMS,
  ADDITIONAL_MENU_ITEMS,
  SOCIAL_MEDIA_ITEMS,
  SUBSCRIBE_URL,
  DONATE_URL,
} from '@/constants'
import { ClearIcon, SettingsIconSmall } from '@/icons'
import Button from '../button'
import { useHeaderContext } from './header-context'
import Image from 'next/image'
import SOCIAL_MEDIA_ICON_MAP from '@/utils/social-media-icon-map'
import { SearchInputSection } from './shared-components'

type MenuProps = {
  isOpen: boolean
  onClose: () => void
  keywords: string[]
}

type MenuItemProps = {
  label: string
  href: string
  subItems?: Array<{ label: string; href: string }>
  external?: boolean
  showIcon?: boolean
  icon?: JSX.Element
  isExpanded?: boolean
  contentClassName?: string
  onExpand?: (label: string | null) => void
}

function MenuItem({
  label,
  href,
  subItems,
  external,
  showIcon,
  icon,
  isExpanded,
  onExpand,
  contentClassName,
}: MenuItemProps) {
  const hasSubItems = subItems && subItems.length > 0
  const context = useHeaderContext()
  const closeMenu = context?.closeMenu

  const handleExpand = () => {
    if (hasSubItems) {
      onExpand?.(isExpanded ? null : label)
    }
  }

  const content = (
    <div
      className={cn(
        'group flex items-center justify-between w-full text-neutral-900 group-hover:text-neutral-900 transition-colors duration-100',
        contentClassName
      )}
    >
      <div className="flex items-center gap-2">
        {showIcon && icon && (
          <div className={cn('w-4 h-4 flex items-center justify-center')}>
            {icon}
          </div>
        )}
        <span
          className={cn(
            'prose-p1-bold',
            isExpanded && 'text-red-400 group-hover:text-red-400'
          )}
        >
          {label}
        </span>
      </div>

      {hasSubItems && (
        <div
          className={cn(
            'w-6 h-6 flex items-center justify-center transition-transform',
            isExpanded && 'rotate-180 text-red-400 group-hover:text-red-400'
          )}
        >
          <svg width="14" height="7" viewBox="0 0 14 7" fill="none">
            <path
              d="M1 1L7 6L13 1"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  )

  if (hasSubItems) {
    return (
      <div className="w-full">
        <button
          onClick={handleExpand}
          className="cursor-pointer w-full px-6 tablet:px-8 py-2 flex items-center justify-between hover:bg-neutral-black/5 active:bg-neutral-black/10 transition-colors duration-200"
        >
          {content}
        </button>
        <div
          className={cn(
            'overflow-hidden transition-all duration-300 ease-in-out',
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          {subItems.map((subItem, index) => (
            <Link
              key={index}
              href={subItem.href}
              className="block px-6 tablet:px-8 py-2 pl-12 prose-p2 font-medium hover:bg-neutral-black/5 active:bg-neutral-black/10 hover:text-neutral-900 transition-colors duration-200"
              onClick={closeMenu}
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      </div>
    )
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={
          'block px-6 tablet:px-8 py-2 hover:bg-neutral-black/5 active:bg-neutral-black/10 transition-colors duration-200'
        }
      >
        {content}
      </a>
    )
  }

  return (
    <Link
      href={href}
      className={
        'block px-6 tablet:px-8 py-2 hover:bg-neutral-black/5 active:bg-neutral-black/10 transition-colors duration-200'
      }
      onClick={closeMenu}
    >
      {content}
    </Link>
  )
}

function MenuItemGroup({ isMenuOpen }: { isMenuOpen: boolean }) {
  const [currentExpandedItem, setCurrentExpandedItem] = useState<string | null>(
    null
  )

  const handleClick = (label: string | null) => {
    setCurrentExpandedItem(label)
  }

  useEffect(() => {
    if (!isMenuOpen) {
      setCurrentExpandedItem(null)
    }
  }, [isMenuOpen])

  return MENU_ITEMS.slice(1).map((item) => (
    <MenuItem
      key={item.label}
      label={item.label}
      href={item.href}
      subItems={item.subItems}
      isExpanded={currentExpandedItem === item.label}
      onExpand={handleClick}
    />
  ))
}

function Divider() {
  return (
    <div className="w-full px-6 tablet:px-8 py-4">
      <div className="w-full h-px bg-neutral-300"></div>
    </div>
  )
}

export function Menu({ isOpen, onClose, keywords }: MenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }

    return () => {
      document.body.classList.remove('no-scroll')
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-neutral-500/50 z-1001 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Menu */}
      <div
        className={cn(
          'fixed top-0 left-0 h-full w-full tablet:w-80 bg-white shadow-2xl z-1001 transform transition-transform duration-300 ease-in-out scrollbar-thin pt-(--mobile-header-height) tablet:pt-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="items-center justify-between px-6 tablet:px-8 py-4 hidden tablet:flex mt-4">
            <div className="flex items-center">
              <Image
                src="/assets/images/brand-icon.svg"
                alt="少年報導者 The Reporter for Kids"
                className="h-5"
                height={20}
                width={183}
                loading="eager"
              />
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 transition-colors duration-200"
              aria-label="關閉選單"
            >
              {ClearIcon}
            </button>
          </div>

          <div className="px-6 tablet:px-8 pt-4 desktop:hidden">
            <SearchInputSection mode="inline" tags={keywords} />
          </div>

          {/* Menu Content */}
          <div className="flex-1 py-4">
            {/* Latest News */}
            <MenuItem label={MENU_ITEMS[0].label} href={MENU_ITEMS[0].href} />

            <Divider />

            {/* Categories */}
            <div className="py-2">
              <MenuItemGroup isMenuOpen={isOpen} />
            </div>

            <Divider />

            {/* Reading Settings */}
            <MenuItem
              label="閱讀探索設定"
              href="/reading-settings"
              showIcon
              icon={SettingsIconSmall}
              contentClassName="text-neutral-600 [&_span]:text-(length:--font-size-p2) hover:text-neutral-900"
            />

            <Divider />

            {/* About Us Section */}
            <div className="py-2">
              {ADDITIONAL_MENU_ITEMS.slice(1).map((item, index) => (
                <MenuItem
                  key={index}
                  label={item.label}
                  href={item.href}
                  external={item.external}
                  contentClassName="text-neutral-600 [&_span]:text-(length:--font-size-p2) hover:text-neutral-900"
                />
              ))}
            </div>

            <Divider />

            {/* Social Media */}
            <div className="px-6 tablet:px-8 py-4">
              <div className="flex items-center gap-4 justify-center tablet:justify-between tablet:gap-0 px-4">
                {SOCIAL_MEDIA_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-neutral-900 hover:text-red-400 transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      {SOCIAL_MEDIA_ICON_MAP[item.label]}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 tablet:px-8 py-6 tablet:pt-6 tablet:pb-8">
            <div className="flex flex-col gap-4 border-t border-neutral-200 ">
              <Button variant="secondary" size={44} asChild className="w-full">
                <a
                  href={SUBSCRIBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  訂閱電子報
                </a>
              </Button>
              <Button variant="primary" size={44} asChild className="w-full">
                <a href={DONATE_URL} target="_blank" rel="noopener noreferrer">
                  贊助我們
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
