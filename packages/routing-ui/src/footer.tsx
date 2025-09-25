import Image from 'next/image'
import Link from 'next/link'

import Button from './components/button'
import { MenuItem, SocialMediaHrefs } from './types'
import { generateSocialMediaConfig } from './utils/generate-social-media-config'

type FooterProps = {
  socialMediaHrefs: SocialMediaHrefs
  additionalMenuItems: MenuItem[]
  donateUrl: string
  privacyPolicyUrl: string
}

const Footer = ({
  socialMediaHrefs,
  additionalMenuItems,
  donateUrl,
  privacyPolicyUrl,
}: FooterProps) => {
  const socialMediaConfig = generateSocialMediaConfig(socialMediaHrefs)

  return (
    <footer className="w-full bg-neutral-white">
      {/* Main Footer Content */}
      <div className="py-12 desktop:py-14 w-full bg-neutral-white px-(--margin-mobile) desktop:px-(--margin-desktop)">
        <div className="max-w-300 mx-auto">
          <div className="gap-8 flex flex-col items-center desktop:flex-row desktop:justify-between">
            {/* Logo and Description */}
            <div className="max-w-100 gap-6 flex w-full flex-col items-center desktop:items-start">
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
              <p className="text-neutral-900 prose-p2 w-full">
                《少年報導者》是由非營利媒體《報導者》針對兒少打造的深度新聞報導品牌，與兒童和少年一起理解世界，參與未來。
              </p>
              <Button size={44} variant="secondary" asChild className="w-75">
                <Link href={donateUrl} target="_blank">
                  贊助我們
                </Link>
              </Button>
            </div>

            <div className="gap-6 flex flex-row">
              <div className="gap-2 flex flex-col">
                {additionalMenuItems.slice(0, 4).map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-neutral-900 prose-p2-bold min-w-30 transition-colors duration-200 hover:text-red-400"
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="gap-2 flex flex-col">
                {additionalMenuItems.slice(4).map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-neutral-900 prose-p2-bold min-w-30 transition-colors duration-200 hover:text-red-400"
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

      <div className="py-6 w-full bg-red-400 px-(--margin-mobile) desktop:px-(--margin-desktop)">
        <div className="max-w-300 mx-auto">
          <div className="gap-5 desktop:gap-4 flex flex-col items-center desktop:flex-row desktop:justify-between">
            <div className="gap-4 order-1 flex items-center desktop:order-2">
              {socialMediaConfig.map((social) => {
                const IconComponent = social.icon
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="hover:text-neutral-200 relative text-neutral-white transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <div className="peer w-6 h-6 relative z-10 flex items-center justify-center rounded-full text-neutral-white transition-all duration-200 hover:text-red-500">
                      {IconComponent}
                    </div>
                    <div className="p-2 peer-hover:bg-white absolute top-1/2 left-1/2 z-1 flex h-[23px] w-[23px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-200"></div>
                  </Link>
                )
              })}
            </div>

            <div className="prose-p3 text-center text-neutral-white desktop:order-1 desktop:text-left">
              <p className="desktop:inline">
                衛部救字第1131363879號｜勸募期間 2025/1/1~12/31
                <span className="hidden desktop:inline">｜</span>
              </p>
              <p className="desktop:inline">
                <Link
                  href={privacyPolicyUrl}
                  target="_blank"
                  className="desktop:ml-1 text-neutral-white underline"
                  rel="noopener noreferrer"
                >
                  隱私政策
                </Link>
                ｜
                <Link
                  href="https://www.twreporter.org/a/license-footer"
                  target="_blank"
                  className="desktop:ml-1 text-neutral-white underline"
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
