import { SOCIAL_MEDIA_ITEMS } from '@/constants'
import { FBIcon, IGIcon, MediumIcon, RSSIcon } from '@/icons/social-media'
import { ThreadsIcon } from '@/icons/social-media'
import { YouTubeIcon } from '@/icons/social-media'

const SOCIAL_MEDIA_ICON_MAP: Record<
  (typeof SOCIAL_MEDIA_ITEMS)[number]['label'],
  React.ReactNode
> = {
  Facebook: FBIcon,
  Instagram: IGIcon,
  Medium: MediumIcon,
  RSS: RSSIcon,
  Threads: ThreadsIcon,
  YouTube: YouTubeIcon,
}

export default SOCIAL_MEDIA_ICON_MAP
