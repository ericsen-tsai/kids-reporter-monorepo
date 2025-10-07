'use client'
import Link from 'next/link'
import { LoginIcon } from '@/icons'
import {
  LogoLink,
  ActionButtons,
  BottomNavigation,
  HamburgerButton,
} from './shared-components'
import { cn } from '@/utils/cn'

type DesktopHeaderProps = {
  onHamburgerOverlayOpen: () => void
  keywords: string[]
  compactMode: boolean
  postTitle?: string
  hide: boolean
}

export function DesktopHeader({
  onHamburgerOverlayOpen,
  keywords,
  compactMode,
  postTitle,
  hide,
}: DesktopHeaderProps) {
  return (
    <>
      <div className="h-(--desktop-header-height) hidden desktop:block"></div>
      <div
        className={cn(
          'hidden desktop:block w-full fixed top-0 left-1/2 transform -translate-x-1/2 z-1000 transition-all duration-500 ease-in-out',
          compactMode && 'bg-white',
          hide
            ? 'opacity-0 -translate-y-full pointer-events-none'
            : 'opacity-100 translate-y-0 pointer-events-auto'
        )}
      >
        <div className="w-full bg-transparent px-12 hidden desktop:block">
          <div className="max-w-300 mx-auto">
            <div className="flex items-center justify-between px-4 py-[18px]">
              <div className={'flex items-center'}>
                <div
                  className={cn(
                    'transition-all duration-300 ease-in-out overflow-hidden',
                    compactMode
                      ? 'opacity-100 scale-100 translate-x-0 w-auto max-w-12 mr-4'
                      : 'opacity-0 scale-95 -translate-x-2 w-0 max-w-0 pointer-events-none'
                  )}
                >
                  <HamburgerButton
                    onHamburgerOverlayOpen={onHamburgerOverlayOpen}
                    small
                  />
                </div>
                <div className={compactMode ? 'mr-12' : 'mr-8'}>
                  <LogoLink />
                </div>
                {postTitle && (
                  <div className="block pr-12">
                    <p className="prose-p2 text-neutral-900 font-medium tracking-wide max-w-124 text-ellipsis overflow-hidden whitespace-nowrap">
                      {postTitle}
                    </p>
                  </div>
                )}
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-500 ease-in-out',
                    compactMode
                      ? 'opacity-0 max-h-0 -translate-y-2 scale-95'
                      : 'opacity-100 max-h-20 translate-y-0 scale-100'
                  )}
                >
                  <span className="prose-p2 text-neutral-900 font-medium tracking-[2.2px]! inline-block translate-y-0 opacity-100">
                    理解世界 × 參與未來
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <ActionButtons tags={keywords} hideCtaButtons={compactMode} />
                <Link
                  href="/login"
                  className="flex items-center justify-center w-8 h-8 text-red-400 hover:text-red-500 rounded-full transition-colors duration-200"
                  aria-label="登入"
                >
                  {LoginIcon}
                </Link>
              </div>
            </div>

            <div
              className={cn(
                'transition-all duration-500 ease-in-out overflow-hidden',
                compactMode
                  ? 'opacity-0 h-0 -translate-y-4'
                  : 'opacity-100 h-auto translate-y-0'
              )}
            >
              <BottomNavigation
                onHamburgerOverlayOpen={onHamburgerOverlayOpen}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
