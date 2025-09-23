import Link from 'next/link'
import {
  PRIVACY_POLICY,
  SOCIAL_MEDIA_ITEMS,
  ADDITIONAL_MENU_ITEMS,
} from '@/constants'

import Image from 'next/image'
import Button from './button'
import SOCIAL_MEDIA_ICON_MAP from '@/utils/social-media-icon-map'

export const Footer = () => {
  return (
    <footer className="w-full bg-neutral-white">
      {/* Main Footer Content */}
      <div className="w-full bg-neutral-white px-(--margin-mobile) py-12 desktop:px-(--margin-desktop) desktop:py-14">
        <div className="max-w-300 mx-auto">
          <div className="flex flex-col items-center gap-8 desktop:flex-row desktop:justify-between">
            {/* Logo and Description */}
            <div className="flex flex-col items-center gap-6 max-w-sm desktop:items-start">
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <Image
                    src="/assets/images/footer-logo.svg"
                    alt="少年報導者"
                    loading="lazy"
                    width={238}
                    height={26}
                  />
                </Link>
              </div>
              <p className="text-neutral-900 prose-p2 text-pretty tablet:w-100">
                《少年報導者》是由非營利媒體《報導者》針對兒少打造的深度新聞報導品牌，與兒童和少年一起理解世界，參與未來。
              </p>
              <Button size={44} variant="secondary" asChild className="w-75">
                <Link href="https://support.twreporter.org/" target="_blank">
                  贊助我們
                </Link>
              </Button>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-row gap-6 desktop:pr-25 hd:pr-0">
              <div className="flex flex-col gap-2">
                {ADDITIONAL_MENU_ITEMS.slice(0, 4).map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-neutral-900 prose-p2-bold hover:text-red-400 transition-colors duration-200 min-w-30"
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {ADDITIONAL_MENU_ITEMS.slice(4).map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-neutral-900 prose-p2-bold hover:text-red-400 transition-colors duration-200 min-w-30"
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full bg-red-400 px-(--margin-mobile) py-6 desktop:px-(--margin-desktop)">
        <div className="max-w-300 mx-auto">
          <div className="flex flex-col items-center gap-5 desktop:flex-row desktop:justify-between desktop:gap-4">
            {/* Social Icons */}
            <div className="flex items-center gap-4 order-1 desktop:order-2">
              {SOCIAL_MEDIA_ITEMS.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="text-neutral-white hover:text-neutral-200 transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <div className="relative peer w-6 h-6 rounded-full flex items-center justify-center text-neutral-white z-10 hover:text-red-500 transition-all duration-200">
                    {SOCIAL_MEDIA_ICON_MAP[social.label]}
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 w-[23px] h-[23px] rounded-full flex items-center justify-center peer-hover:bg-white z-1 transition-all duration-200"></div>
                </Link>
              ))}
            </div>

            {/* Legal Text */}
            <div className="text-neutral-white prose-p3 text-center desktop:text-left desktop:order-1">
              <p className="desktop:inline">
                衛部救字第1131363879號｜勸募期間 2025/1/1~12/31
                <span className="hidden desktop:inline">｜</span>
              </p>
              <p className="desktop:inline">
                <Link
                  href={PRIVACY_POLICY}
                  target="_blank"
                  className="text-neutral-white underline desktop:ml-1"
                  rel="noopener noreferrer"
                >
                  隱私政策
                </Link>
                ｜
                <Link
                  href="https://www.twreporter.org/a/license-footer"
                  target="_blank"
                  className="text-neutral-white underline desktop:ml-1"
                  rel="noopener noreferrer"
                >
                  許可協議
                </Link>
              </p>
              <p className="hidden desktop:inline">｜</p>
              <p className="desktop:inline">
                Copyright © {new Date().getFullYear()} The Reporter
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
