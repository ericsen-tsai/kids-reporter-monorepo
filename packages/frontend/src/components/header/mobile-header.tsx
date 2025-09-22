'use client'
import Link from 'next/link'
import { LoginIcon } from '@/icons'
import { LogoLink, HamburgerButton } from './shared-components'
import { cn } from '@/utils/cn'
import { useIsAtTop } from '@/utils/custom-hook'

type MobileHeaderProps = {
  onHamburgerOverlayOpen: () => void
  isFixed?: boolean
}

export function MobileHeader({
  onHamburgerOverlayOpen,
  isFixed = false,
}: MobileHeaderProps) {
  const isAtTop = useIsAtTop()
  return (
    <div
      className={cn(
        'w-full px-6 tablet:px-8 desktop:hidden transition-all duration-300 ease-in-out',
        isFixed && 'fixed top-0 z-1000 bg-neutral-white shadow-lg',
        isFixed && isAtTop && 'opacity-0 -translate-y-full pointer-events-none',
        isFixed && !isAtTop && 'opacity-100 translate-y-0 pointer-events-auto'
      )}
    >
      <div className="flex items-center justify-between py-6">
        <LogoLink />

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="登入"
          >
            {LoginIcon}
          </Link>
          <HamburgerButton onHamburgerOverlayOpen={onHamburgerOverlayOpen} />
        </div>
      </div>
    </div>
  )
}
