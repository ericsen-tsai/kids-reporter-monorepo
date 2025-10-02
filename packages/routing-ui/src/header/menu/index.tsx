'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { cn } from '../../utils/cn'
import { ClearIcon } from '../../icons/index'
import Button from '../../components/button'
import Image from 'next/image'
import { SearchInputSection } from '../shared-components'
import { generateSocialMediaConfig } from '../../utils/generate-social-media-config'
import type { MenuItem, SocialMediaHrefs } from '../../types'
import HeaderMenuItem from './header-menu-item'
import HeaderMenuItemGroup from './header-menu-item-group'

type MenuProps = {
  isOpen: boolean
  onClose: () => void
  keywords: string[]
  menuItems: MenuItem[]
  additionalMenuItems: MenuItem[]
  socialMediaHrefs: SocialMediaHrefs
  donateUrl: string
  subscribeUrl: string
  searchPlaceholder: string
}

function Divider() {
  return (
    <div className="w-full px-6 tablet:px-8 py-4">
      <div className="w-full h-px bg-neutral-300"></div>
    </div>
  )
}

function Menu({
  isOpen,
  onClose,
  keywords,
  menuItems,
  additionalMenuItems,
  socialMediaHrefs,
  donateUrl,
  subscribeUrl,
  searchPlaceholder,
}: MenuProps) {
  const socialMediaConfig = generateSocialMediaConfig(socialMediaHrefs)

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }

    return () => {
      document.body.classList.remove('no-scroll')
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-neutral-500/50 z-1001 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Menu */}
      <div
        className={cn(
          'fixed top-0 left-0 h-full w-full tablet:w-80 bg-white shadow-2xl z-1001 transform transition-transform duration-300 ease-in-out scrollbar-thin pt-(--mobile-header-height) tablet:pt-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="items-center justify-between px-6 tablet:px-8 py-4 hidden tablet:flex mt-4">
            <div className="flex items-center">
              <Link href="/">
                <Image
                  src="/assets/images/brand-icon.svg"
                  alt="少年報導者 The Reporter for Kids"
                  className="h-5"
                  height={20}
                  width={183}
                  loading="eager"
                />
              </Link>
            </div>
            <button
              onClick={onClose}
              className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full text-neutral-600 hover:text-neutral-800 transition-colors duration-200"
              aria-label="關閉選單"
            >
              {ClearIcon}
            </button>
          </div>

          <div className="px-6 tablet:px-8 pt-4 desktop:hidden">
            <SearchInputSection
              mode="inline"
              tags={keywords}
              searchPlaceholder={searchPlaceholder}
            />
          </div>

          {/* Menu Content */}
          <div className="flex-1 py-4">
            {/* Latest News */}
            <HeaderMenuItem
              label={menuItems[0].label}
              href={menuItems[0].href}
            />

            <Divider />

            {/* Categories */}
            <div className="py-2">
              <HeaderMenuItemGroup isMenuOpen={isOpen} menuItems={menuItems} />
            </div>

            <Divider />

            {/* Reading Settings */}
            <HeaderMenuItem
              {...additionalMenuItems?.[0]}
              contentClassName="text-neutral-600 [&_span]:[font-family:var(--font-family-noto)] [&_span]:[font-size:var(--font-size-p2)] [&_span]:[font-weight:500] [&_span]:[line-height:var(--line-height-normal)] [&_span]:[letter-spacing:var(--letter-spacing-wide)] hover:text-neutral-900"
            />

            <Divider />

            {/* About Us Section */}
            <div className="py-2">
              {additionalMenuItems.slice(1).map((item, index) => (
                <HeaderMenuItem
                  key={index}
                  label={item.label}
                  href={item.href}
                  external={item.external}
                  contentClassName="text-neutral-600 [&_span]:[font-family:var(--font-family-noto)] [&_span]:[font-size:var(--font-size-p2)] [&_span]:[font-weight:500] [&_span]:[line-height:var(--line-height-normal)] [&_span]:[letter-spacing:var(--letter-spacing-wide)] hover:text-neutral-900"
                />
              ))}
            </div>

            <Divider />

            {/* Social Media */}
            <div className="px-6 tablet:px-8">
              <div className="flex items-center gap-4 justify-center tablet:justify-between tablet:gap-0 px-4">
                {socialMediaConfig.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-neutral-900 hover:text-red-500 transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      {item.icon}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 tablet:px-8 py-6 tablet:pt-6 tablet:pb-8">
            <div className="flex flex-col gap-4">
              <Button variant="secondary" size={44} asChild className="w-full">
                <a
                  href={subscribeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  訂閱電子報
                </a>
              </Button>
              <Button variant="primary" size={44} asChild className="w-full">
                <a href={donateUrl} target="_blank" rel="noopener noreferrer">
                  贊助我們
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Menu
