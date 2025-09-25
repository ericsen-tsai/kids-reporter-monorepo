'use client'
import {
  ScrollLevel,
  useIsAtTop,
  useMediaQuery,
  useScrollLevel,
} from '../hooks'
import type { MenuItem, SocialMediaHrefs } from '../types'
import { DesktopHeader } from './desktop-header'
import { useHeaderContext } from './header-context'
import Menu from './menu'
import { MobileHeader } from './mobile-header'

type HeaderProps = {
  menuItems: MenuItem[]
  additionalMenuItems: MenuItem[]
  socialMediaHrefs: SocialMediaHrefs
  searchPlaceholder: string
  subscribeUrl: string
  donateUrl: string
}

function Header({
  menuItems,
  additionalMenuItems,
  socialMediaHrefs,
  searchPlaceholder,
  subscribeUrl,
  donateUrl,
}: HeaderProps) {
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
    throttleThreshold: 50,
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
        searchPlaceholder={searchPlaceholder}
        subscribeUrl={subscribeUrl}
        menuItems={menuItems}
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
        menuItems={menuItems}
        additionalMenuItems={additionalMenuItems}
        socialMediaHrefs={socialMediaHrefs}
        donateUrl={donateUrl}
        subscribeUrl={subscribeUrl}
        searchPlaceholder={searchPlaceholder}
      />
    </>
  )
}

export default Header
