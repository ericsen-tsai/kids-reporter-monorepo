'use client'
import { MobileHeader } from './mobile-header'
import { DesktopHeader } from './desktop-header'
import { Menu } from './menu'
import { useHeaderContext } from './header-context'
import { ScrollLevel, useIsAtTop, useScrollLevel } from '@/utils/custom-hook'
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
  const scrollingLevel = useScrollLevel({
    scrollDownDistance: 150,
    throttleThreshold: 500,
  })

  const isScrollingDown = scrollingLevel === ScrollLevel.DOWN_HIDDEN

  return (
    <>
      <DesktopHeader
        onHamburgerOverlayOpen={onHamburgerOverlayOpen}
        keywords={keywords}
        hide={isScrollingDown}
        compactMode={!isAtTop}
        postTitle={isAtTop ? undefined : postTitle}
      />
      <MobileHeader
        onCloseMenu={onCloseMenu}
        showCloseButtonWhenMenuOpen={isMobile}
        onHamburgerOverlayOpen={onHamburgerOverlayOpen}
        isMenuOpen={isMenuOpen}
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
