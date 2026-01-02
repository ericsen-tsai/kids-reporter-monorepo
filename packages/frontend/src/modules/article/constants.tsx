import { toast } from 'sonner'

import {
  FaceBookIcon,
  LineIcon,
  LinkIcon,
  ThreadsIcon,
} from '@/icons/miscellaneous'

export const TABLE_OF_CONTENT_ANCHOR_PREFIX = 'toc-anchor'
export const TABLE_OF_CONTENT_INDEX_PREFIX = 'toc-index'
export const TABLE_OF_CONTENT_BACK_TO_TOP_KEY = 'back-to-top'

export const SHARE_ICONS = [
  {
    icon: <FaceBookIcon />,
    label: 'Facebook',
    onClick: () => {
      const currentURL = window.location.href
      const location =
        'https://www.facebook.com/sharer/sharer.php?' +
        `u=${encodeURIComponent(currentURL)}`
      window.open(location, '_blank')
    },
  },
  {
    icon: <ThreadsIcon />,
    label: 'Threads',
    onClick: () => {
      const currentURL = window.location.href
      const location = `https://www.threads.net/intent/post?text=${encodeURIComponent(currentURL)}`
      window.open(location, '_blank')
    },
  },
  {
    icon: <LineIcon />,
    label: 'Line',
    onClick: () => {
      const currentURL = window.location.href
      const location = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
        currentURL
      )}`
      window.open(location, '_blank')
    },
  },
  {
    icon: (
      <div className="flex aspect-square w-10 cursor-pointer appearance-none flex-col items-center justify-center rounded-full bg-neutral-600">
        <LinkIcon />
      </div>
    ),
    label: 'Link',
    onClick: () => {
      const currentURL = window.location.href
      navigator.clipboard.writeText(currentURL).then(() => {
        toast.success('已複製文章網址')
      })
    },
  },
]
