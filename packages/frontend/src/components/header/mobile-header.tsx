'use client'
import Link from 'next/link'
import { ClearIcon, LoginIcon } from '@/icons'
import { LogoLink, HamburgerButton } from './shared-components'
import { cn } from '@/utils/cn'

type MobileHeaderProps =
  | {
      isFixed: false
      onHamburgerOverlayOpen: () => void
    }
  | {
      isFixed: true
      onHamburgerOverlayOpen: () => void
      onCloseMenu: () => void
      hide: boolean
      showCloseButtonWhenMenuOpen: boolean
      isMenuOpen: boolean
    }

export function MobileHeader({
  isFixed = false,
  onHamburgerOverlayOpen,
  ...otherProps
}: MobileHeaderProps) {
  const onCloseMenu =
    'onCloseMenu' in otherProps ? otherProps.onCloseMenu : () => undefined
  const hide = 'hide' in otherProps ? otherProps.hide : isFixed
  const showCloseButtonWhenMenuOpen =
    'showCloseButtonWhenMenuOpen' in otherProps
      ? otherProps.showCloseButtonWhenMenuOpen
      : isFixed
  const isMenuOpen =
    'isMenuOpen' in otherProps ? otherProps.isMenuOpen : isFixed

  const showCloseButton = showCloseButtonWhenMenuOpen && isMenuOpen

  return (
    <div
      className={cn(
        'w-full px-6 tablet:px-8 desktop:hidden transition-all duration-300 ease-in-out',
        isFixed && 'fixed top-0 z-1000 bg-neutral-white shadow-sm',
        isFixed &&
          hide &&
          'opacity-0 -translate-y-full pointer-events-none z-1002 tablet:z-1000',
        isFixed &&
          !hide &&
          'opacity-100 translate-y-0 pointer-events-auto z-1002 tablet:z-1000'
      )}
    >
      <div className="flex items-center justify-between py-4">
        <LogoLink />

        <div className="flex items-center gap-4">
          {!showCloseButton && (
            <Link
              href="/login"
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="登入"
            >
              {LoginIcon}
            </Link>
          )}
          {showCloseButton ? (
            <button
              onClick={onCloseMenu}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="關閉選單"
            >
              {ClearIcon}
            </button>
          ) : (
            <HamburgerButton onHamburgerOverlayOpen={onHamburgerOverlayOpen} />
          )}
        </div>
      </div>
    </div>
  )
}
