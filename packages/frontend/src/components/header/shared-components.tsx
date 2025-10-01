'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  HamburgerIcon,
  SearchIcon,
  SettingsIcon,
  ClearIcon,
  HamburgerIconSmall,
} from '@/icons'
import { SEARCH_PLACEHOLDER, SUBSCRIBE_URL, MENU_ITEMS } from '@/constants'
import { cva } from 'class-variance-authority'
import Input from '../input'
import Image from 'next/image'
import Button from '../button'

const searchFormVariants = cva(
  'h-full transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        inline: 'w-full h-11',
        popover: 'absolute top-0 right-28 overflow-hidden w-66 opacity-0',
      },
      isSearchOpen: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        mode: 'popover',
        isSearchOpen: true,
        class: 'opacity-100 w-66 pointer-events-auto',
      },
      {
        mode: 'popover',
        isSearchOpen: false,
        class: 'pointer-events-none',
      },
    ],
  }
)

const searchDropdownVariants = cva(
  'bg-neutral-white rounded-xl mt-2 w-66 transition-all duration-200 ease-in-out z-50 h-0 p-0 opacity-0',
  {
    variants: {
      mode: {
        inline: '',
        popover: 'absolute top-12 right-28 shadow-custom p-4',
      },
      isSearchOpen: {
        true: '',
        false: '',
      },
      isFocused: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        mode: 'popover',
        isSearchOpen: true,
        isFocused: true,
        class: 'p-4 h-min opacity-100',
      },
      {
        mode: 'inline',
        isFocused: true,
        class:
          'w-full opacity-100 h-min translate-y-0 pt-6 mt-0 bg-neutral-transparent',
      },
      {
        mode: 'inline',
        isFocused: false,
        class: 'w-full -translate-y-10 pointer-events-none',
      },
    ],
  }
)

export function LogoLink() {
  return (
    <Link href="/" className="flex items-center" rel="home">
      <Image
        src="/assets/images/brand-icon.svg"
        alt="少年報導者 The Reporter for Kids"
        loading="eager"
        className="h-5 w-auto tablet:h-6 desktop:h-[26px]"
        width={293}
        height={32}
      />
    </Link>
  )
}

type SearchInputSectionProps =
  | {
      mode: 'popover'
      isSearchOpen: boolean
      tags: string[]
    }
  | {
      mode: 'inline'
      tags: string[]
    }

export function SearchInputSection(props: SearchInputSectionProps) {
  const ref = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const mode = props.mode
  const isSearchOpen = mode === 'popover' && props.isSearchOpen
  const tags = props.tags

  useEffect(() => {
    if (mode === 'inline') {
      return
    }
    if (isSearchOpen) {
      ref.current?.focus()
      setIsFocused(true)
      document.body.classList.add('no-scroll')
      return
    }
    setIsFocused(false)
    document.body.classList.remove('no-scroll')
  }, [mode, isSearchOpen])

  return (
    <div
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={mode === 'inline' ? 'w-full' : 'h-11'}
    >
      <form
        role="search"
        method="get"
        action="/search"
        className={searchFormVariants({
          mode,
          isSearchOpen: mode === 'popover' ? isSearchOpen : undefined,
        })}
      >
        <Input
          placeholder={SEARCH_PLACEHOLDER}
          name="q"
          title="Search for..."
          aria-label="Search for..."
          className="w-[99%]"
          inputRef={ref}
          onChange={setSearchValue}
          value={searchValue}
        />
      </form>
      <div
        className={searchDropdownVariants({
          mode,
          isSearchOpen: mode === 'popover' ? isSearchOpen : undefined,
          isFocused,
        })}
      >
        <h3 className="prose-p3 font-bold text-neutral-700 mb-3">熱門搜尋</h3>
        <div className="flex flex-wrap gap-2.5">
          {tags.map((keyword) => (
            <a
              key={keyword}
              className="cursor-pointer transition-colors duration-200 rounded-full px-3 py-1 prose-p2 font-bold text-neutral-900 bg-neutral-200 hover:bg-red-500 hover:text-neutral-white"
              href={`/search?q=${encodeURIComponent(keyword)}`}
            >
              # {keyword}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ActionButtons({
  hideCtaButtons = false,
  tags,
}: {
  hideCtaButtons?: boolean
  tags: string[]
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const containerElement = containerRef.current
      const buttonElement = buttonRef.current
      if (!containerElement || !buttonElement) return
      if (
        !containerElement.contains(event.target as Node) &&
        !buttonElement.contains(event.target as Node)
      ) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="flex items-center relative">
      <div className="flex items-center mr-6" ref={containerRef}>
        {/* CTA Buttons - Base layer */}
        {!hideCtaButtons && !isSearchOpen && (
          <div className="flex items-center gap-4">
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

        <SearchInputSection
          isSearchOpen={isSearchOpen}
          mode="popover"
          tags={tags}
        />
      </div>

      <button
        className="flex items-center cursor-pointer justify-center min-w-10 w-10 h-10 rounded-full text-neutral-600 hover:text-neutral-800 transition-all duration-200 mr-4"
        aria-label="搜尋"
        onClick={() => setIsSearchOpen(!isSearchOpen)}
        ref={buttonRef}
      >
        {isSearchOpen ? ClearIcon : SearchIcon}
      </button>
      <button
        className="flex items-center cursor-pointer justify-center min-w-10 w-10 h-10 rounded-full text-neutral-600 hover:text-neutral-800 transition-all duration-200"
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
      <HamburgerButton onHamburgerOverlayOpen={onHamburgerOverlayOpen} small />

      {MENU_ITEMS.reduce((acc, item, index) => {
        return [
          ...acc,
          <div key={item.label} className="flex items-center">
            <Link
              href={item.href}
              className="py-1 prose-p1 text-neutral-900 font-bold! hover:text-red-400 transition-colors h-6 flex items-center"
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
  small = false,
}: {
  onHamburgerOverlayOpen: () => void
  small?: boolean
}) {
  return (
    <button
      className="cursor-pointer flex items-center justify-center rounded-sm transition-all duration-300 ease-in-out hover:[&>svg>rect:nth-child(1)]:fill-blue-500 hover:[&>svg>rect:nth-child(3)]:fill-yellow-500 hover:[&>svg>rect:nth-child(2)]:fill-red-500 hover:[&>svg>path:nth-child(1)]:fill-blue-500 hover:[&>svg>path:nth-child(3)]:fill-yellow-500 hover:[&>svg>path:nth-child(2)]:fill-red-500"
      onClick={onHamburgerOverlayOpen}
    >
      {small ? HamburgerIconSmall : HamburgerIcon}
    </button>
  )
}
