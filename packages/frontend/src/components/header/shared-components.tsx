'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { HamburgerIcon, SearchIcon, SettingsIcon, ClearIcon } from '@/icons'
import {
  SEARCH_PLACEHOLDER,
  SUBSCRIBE_URL,
  MENU_ITEMS,
  POPULAR_KEYWORDS,
} from '@/constants'
import { cn } from '@/utils/cn'
import Input from '../input'
import Image from 'next/image'
import Button from '../button'

export function LogoLink() {
  return (
    <Link href="/" className="flex items-center" rel="home">
      <Image
        src="/assets/images/brand-icon.svg"
        alt="少年報導者 The Reporter for Kids"
        loading="eager"
        width={293}
        height={32}
      />
    </Link>
  )
}

export function SearchInputSection({
  isSearchOpen,
}: {
  isSearchOpen: boolean
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  useEffect(() => {
    if (isSearchOpen) {
      ref.current?.focus()
    }
  }, [isSearchOpen])

  return (
    <div onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}>
      <form
        role="search"
        method="get"
        action="/search"
        className={cn(
          'h-full transition-all duration-300 ease-in-out overflow-hidden absolute top-0 right-28',
          isSearchOpen ? 'w-66' : 'w-0'
        )}
      >
        <Input
          placeholder={SEARCH_PLACEHOLDER}
          name="q"
          title="Search for..."
          aria-label="Search for..."
          className="w-full h-full"
          inputRef={ref}
          onChange={setSearchValue}
          value={searchValue}
        />
      </form>
      <div
        className={cn(
          'bg-neutral-white rounded-xl p-4 mt-2 w-66  absolute top-12 overflow-hidden right-28 transition-all duration-300 ease-in-out shadow-lg z-50',
          isSearchOpen && isFocused
            ? 'p-4 h-auto opacity-100'
            : 'h-0 p-0 opacity-0'
        )}
      >
        <h3 className="text-p3 font-bold text-neutral-700 mb-3">熱門搜尋</h3>
        <div className="flex flex-wrap gap-2.5">
          {POPULAR_KEYWORDS.map((keyword) => (
            <button
              key={keyword}
              className="cursor-pointer bg-neutral-200 hover:bg-neutral-300 transition-colors duration-200 rounded-full px-3 py-1 text-p2 font-bold text-neutral-900"
              onClick={() => setSearchValue(keyword)}
            >
              # {keyword}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ActionButtons({
  hideCtaButtons = false,
}: {
  hideCtaButtons?: boolean
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <div className="flex items-center gap-4 relative">
      <div className="flex items-center">
        {/* CTA Buttons - Base layer */}
        {!hideCtaButtons && !isSearchOpen && (
          <div className="flex items-center gap-2">
            <Button variant="secondary" size={32} asChild>
              <Link href="/about#post">投稿</Link>
            </Button>
            <Button variant="primary" size={32} asChild>
              <Link
                href={SUBSCRIBE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                訂閱
              </Link>
            </Button>
          </div>
        )}

        <SearchInputSection isSearchOpen={isSearchOpen} />
      </div>

      <button
        className="flex items-center cursor-pointer justify-center min-w-10 w-10 h-10 rounded-full hover:bg-gray-100 transition-colors duration-200"
        aria-label="搜尋"
        onClick={() => setIsSearchOpen(!isSearchOpen)}
      >
        {isSearchOpen ? ClearIcon : SearchIcon}
      </button>
      <button
        className="flex items-center cursor-pointer justify-center min-w-10 w-10 h-10 rounded-full hover:bg-gray-100 transition-colors duration-200"
        aria-label="設定"
      >
        {SettingsIcon}
      </button>
    </div>
  )
}

export function BottomNavigation({
  onHamburgerOverlayOpen,
}: {
  onHamburgerOverlayOpen: () => void
}) {
  return (
    <div className="flex items-center justify-between w-full py-2 border-y border-neutral-border px-4">
      <HamburgerButton onHamburgerOverlayOpen={onHamburgerOverlayOpen} />

      {MENU_ITEMS.reduce((acc, item, index) => {
        return [
          ...acc,
          <div key={item.label} className="flex items-center">
            <Link
              href={item.href}
              className="py-1 text-p1 text-neutral-900 font-bold hover:text-red-400 transition-colors h-6 flex items-center"
            >
              {item.label}
            </Link>
          </div>,
          ...(index < MENU_ITEMS.length - 1
            ? [
                <div
                  key={`separator-${index}`}
                  className="w-px h-4 bg-neutral-border mx-2"
                />,
              ]
            : []),
        ]
      }, [] as React.ReactNode[])}
    </div>
  )
}

export function HamburgerButton({
  onHamburgerOverlayOpen,
  hidden = false,
}: {
  onHamburgerOverlayOpen: () => void
  hidden?: boolean
}) {
  return (
    <button
      className={cn(
        'flex items-center justify-center rounded-sm hover:bg-gray-100 transition-all duration-200',
        hidden && 'opacity-0 w-0'
      )}
      onClick={onHamburgerOverlayOpen}
    >
      {HamburgerIcon}
    </button>
  )
}
