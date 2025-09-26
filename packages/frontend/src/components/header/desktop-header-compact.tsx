'use client'
import Link from 'next/link'
import { LoginIcon } from '@/icons'
import { LogoLink, ActionButtons, HamburgerButton } from './shared-components'
import { cn } from '@/utils/cn'

type DesktopHeaderCompactProps = {
  onHamburgerOverlayOpen: () => void
  postTitle?: string
  keywords: string[]
  hide: boolean
}

export function DesktopHeaderCompact({
  onHamburgerOverlayOpen,
  postTitle,
  keywords,
  hide,
}: DesktopHeaderCompactProps) {
  return (
    <div
      className={cn(
        'w-full bg-white hidden desktop:block fixed top-0 left-1/2 transform -translate-x-1/2 z-1000 transition-all duration-300 ease-in-out shadow-sm',
        hide
          ? 'opacity-0 -translate-y-full pointer-events-none'
          : 'opacity-100 translate-y-0 pointer-events-auto'
      )}
    >
      <div className="flex items-center justify-between py-[14px] desktop:px-16 max-w-300 mx-auto">
        <div className="flex items-center gap-4">
          <HamburgerButton onHamburgerOverlayOpen={onHamburgerOverlayOpen} />

          <div className="flex items-center gap-12">
            <LogoLink />
            {postTitle && (
              <div className="hidden desktop:block pr-12">
                <p className="prose-p2 text-neutral-900 font-medium tracking-wide max-w-124 text-ellipsis overflow-hidden whitespace-nowrap">
                  {postTitle}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ActionButtons hideCtaButtons={true} tags={keywords} />
          <Link
            href="/login"
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="登入"
          >
            {LoginIcon}
          </Link>
        </div>
      </div>
    </div>
  )
}
