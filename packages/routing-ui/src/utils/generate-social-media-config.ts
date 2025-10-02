import {
  FBIcon,
  IGIcon,
  YouTubeIcon,
  ThreadsIcon,
  MediumIcon,
  RSSIcon,
} from '../icons'
import { JSX } from 'react'
import { SocialMediaHrefs } from '../types'

export type SocialMediaConfig = {
  label: string
  href: string
  icon: JSX.Element | null
}

export function generateSocialMediaConfig(
  socialMediaHrefs: SocialMediaHrefs
): SocialMediaConfig[] {
  return socialMediaHrefs.map((href) => {
    // Extract domain from URL to determine the social media platform
    let label = 'Unknown'
    let icon = null
    try {
      const url = new URL(href)
      const hostname = url.hostname.toLowerCase()

      // Check for specific patterns
      if (hostname.includes('facebook.com')) {
        label = 'Facebook'
        icon = FBIcon
      } else if (hostname.includes('instagram.com')) {
        label = 'Instagram'
        icon = IGIcon
      } else if (
        hostname.includes('youtube.com') ||
        hostname.includes('youtu.be')
      ) {
        label = 'YouTube'
        icon = YouTubeIcon
      } else if (
        hostname.includes('threads.net') ||
        hostname.includes('threads.com')
      ) {
        label = 'Threads'
        icon = ThreadsIcon
      } else if (hostname.includes('medium.com')) {
        label = 'Medium'
        icon = MediumIcon
      } else if (href.includes('rss.xml') || href.includes('rss')) {
        label = 'RSS'
        icon = RSSIcon
      }
    } catch {
      console.warn(`Invalid URL provided: ${href}`)
    }

    if (!icon) {
      console.warn(`No icon found for social media platform: ${label}`)
      return {
        label,
        href,
        icon: null, // or a default icon component
      }
    }

    return {
      label,
      href,
      icon,
    }
  })
}
