'use client'
import { MobileHeader } from './mobile-header'
import { DesktopHeader } from './desktop-header'
import { DesktopHeaderCompact } from './desktop-header-compact'
import { Menu } from './menu'
import { useHeaderContext } from './header-context'
import { useIsAtTop } from '@/utils/custom-hook'
import { useMediaQuery } from '@/utils/hooks'

function Header() {
  const context = useHeaderContext()
  const postTitle = context?.postTitle
  const isMenuOpen = context?.isMenuOpen || false
  const openMenu = context?.openMenu
  const closeMenu = context?.closeMenu
  const keywords = context?.keywords || []
  const onHamburgerOverlayOpen = () => {
    openMenu?.()
  }

  const onCloseMenu = () => {
    closeMenu?.()
  }

  const isMobile = useMediaQuery('(max-width: 768px)')

  const isAtTop = useIsAtTop()

  return (
    <>
      <div className="hidden desktop:block w-full max-w-300 mx-auto">
        <DesktopHeader
          onHamburgerOverlayOpen={onHamburgerOverlayOpen}
          keywords={keywords}
        />
      </div>
      <MobileHeader
        onCloseMenu={onCloseMenu}
        showCloseButtonWhenMenuOpen={isMobile}
        onHamburgerOverlayOpen={onHamburgerOverlayOpen}
        isMenuOpen={isMenuOpen}
      />
      <DesktopHeaderCompact
        onHamburgerOverlayOpen={onHamburgerOverlayOpen}
        postTitle={postTitle}
        keywords={keywords}
        hide={isAtTop}
      />
      <Menu
        isOpen={isMenuOpen}
        onClose={closeMenu || (() => undefined)}
        keywords={keywords}
      />
    </>
  )
}

export default Header
