'use client'
import Link from 'next/link'
import { ClearIcon, LoginIcon } from '../icons'
import { LogoLink, HamburgerButton } from './shared-components'
import { cn } from '../utils/cn'

type MobileHeaderProps = {
  onHamburgerOverlayOpen: () => void
  onCloseMenu: () => void
  showCloseButtonWhenMenuOpen: boolean
  isMenuOpen: boolean
}

export function MobileHeader({
  onHamburgerOverlayOpen,
  onCloseMenu,
  showCloseButtonWhenMenuOpen,
  isMenuOpen,
}: MobileHeaderProps) {
  const showCloseButton = showCloseButtonWhenMenuOpen && isMenuOpen

  return (
    <>
      <div className="h-(--mobile-header-height) desktop:hidden"></div>
      <div
        className={cn(
          'w-full px-6 tablet:px-8 desktop:hidden transition-all duration-300 ease-in-out fixed top-0 bg-neutral-white opacity-100 translate-y-0 pointer-events-auto z-1002 tablet:z-1000'
        )}
      >
        <div className="flex items-center justify-between py-4">
          <LogoLink />

          <div className="flex items-center gap-4">
            {!showCloseButton && (
              <Link
                href="/login"
                className="flex items-center justify-center w-8 h-8 rounded-full text-red-400 hover:text-red-500 transition-colors duration-200"
                aria-label="登入"
              >
                {LoginIcon}
              </Link>
            )}
            {showCloseButton ? (
              <button
                onClick={onCloseMenu}
                className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full text-neutral-600 hover:text-neutral-800 transition-colors duration-200"
                aria-label="關閉選單"
              >
                {ClearIcon}
              </button>
            ) : (
              <HamburgerButton
                onHamburgerOverlayOpen={onHamburgerOverlayOpen}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
