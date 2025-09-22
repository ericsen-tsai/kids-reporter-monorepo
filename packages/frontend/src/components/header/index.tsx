'use client'
import { MobileHeader } from './mobile-header'
import { DesktopHeader } from './desktop-header'
import { DesktopHeaderCompact } from './desktop-header-compact'

function Header({
  // TODO: remove mock post title
  postTitle = 'Hello World Hello WorldHello WorldHello WorldHello WorldHello World Hello WorldHello WorldHello WorldHello WorldHello World Hello WorldHello WorldHello WorldHello WorldHello World Hello WorldHello WorldHello WorldHello World',
}: {
  postTitle?: string
}) {
  const onHamburgerOverlayOpen = () => {
    document.body.classList.add('no-scroll')
  }

  return (
    <>
      <div className="w-full max-w-300 mx-auto">
        <MobileHeader onHamburgerOverlayOpen={onHamburgerOverlayOpen} />

        <DesktopHeader onHamburgerOverlayOpen={onHamburgerOverlayOpen} />
      </div>
      <MobileHeader onHamburgerOverlayOpen={onHamburgerOverlayOpen} isFixed />
      <DesktopHeaderCompact
        onHamburgerOverlayOpen={onHamburgerOverlayOpen}
        postTitle={postTitle}
      />
    </>
  )
}

export default Header
