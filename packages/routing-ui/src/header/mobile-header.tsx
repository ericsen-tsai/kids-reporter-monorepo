'use client'

import { ArrowIcon, ClearIcon, LoginIcon } from '../icons'
import { cn } from '../utils/cn'
import { HamburgerButton, LogoLink } from './shared-components'

type MobileHeaderProps = {
  onHamburgerOverlayOpen: () => void
  onCloseMenu: () => void
  showCloseButtonWhenMenuOpen: boolean
  isMenuOpen: boolean
  isLoggedIn?: boolean
  mobileBackButtonHref?: string
}

export function MobileHeader({
  onHamburgerOverlayOpen,
  onCloseMenu,
  showCloseButtonWhenMenuOpen,
  isMenuOpen,
  isLoggedIn,
  mobileBackButtonHref,
}: MobileHeaderProps) {
  const showCloseButton = showCloseButtonWhenMenuOpen && isMenuOpen

  return (
    <>
      <div className="h-(--mobile-header-height) desktop:hidden"></div>
      <div
        className={cn(
          'px-6 tablet:px-8 ease-in-out top-0 translate-y-0 pointer-events-auto fixed z-1002 w-full bg-neutral-white opacity-100 transition-all duration-300 tablet:z-1000 desktop:hidden'
        )}
      >
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-center">
            {mobileBackButtonHref && (
              <a
                href={mobileBackButtonHref}
                className="size-8 mr-2 flex cursor-pointer items-center justify-center tablet:hidden"
              >
                <ArrowIcon />
              </a>
            )}
            <LogoLink />
          </div>

          <div className="gap-4 flex items-center">
            {!showCloseButton && (
              <a
                href={isLoggedIn ? '/member' : '/login'}
                className="w-8 h-8 flex items-center justify-center rounded-full text-red-400 transition-colors duration-200 hover:text-red-500"
                aria-label="登入"
              >
                <LoginIcon />
              </a>
            )}
            {showCloseButton ? (
              <button
                onClick={onCloseMenu}
                className="w-8 h-8 flex cursor-pointer items-center justify-center rounded-full text-neutral-600 transition-colors duration-200 hover:text-neutral-800"
                aria-label="關閉選單"
              >
                <ClearIcon />
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
