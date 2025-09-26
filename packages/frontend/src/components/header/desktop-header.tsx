'use client'
import Link from 'next/link'
import { LoginIcon } from '@/icons'
import { LogoLink, ActionButtons, BottomNavigation } from './shared-components'

type DesktopHeaderProps = {
  onHamburgerOverlayOpen: () => void
  keywords: string[]
}

export function DesktopHeader({
  onHamburgerOverlayOpen,
  keywords,
}: DesktopHeaderProps) {
  return (
    <div className="w-full bg-transparent px-12 hidden desktop:block">
      <div className="flex items-center justify-between px-4 py-[18px]">
        <div className="flex items-center gap-8">
          <LogoLink />
          <div>
            <span className="prose-p2 text-neutral-900 font-medium tracking-wide">
              理解世界 × 參與未來
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ActionButtons tags={keywords} />
          <Link
            href="/login"
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="登入"
          >
            {LoginIcon}
          </Link>
        </div>
      </div>

      <BottomNavigation onHamburgerOverlayOpen={onHamburgerOverlayOpen} />
    </div>
  )
}
