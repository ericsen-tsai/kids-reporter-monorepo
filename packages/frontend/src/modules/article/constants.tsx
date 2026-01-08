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
      window.open(location, '_blank', 'noopener,noreferrer')
    },
  },
  {
    icon: <ThreadsIcon />,
    label: 'Threads',
    onClick: () => {
      const currentURL = window.location.href
      const location = `https://www.threads.net/intent/post?text=${encodeURIComponent(currentURL)}`
      window.open(location, '_blank', 'noopener,noreferrer')
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
      window.open(location, '_blank', 'noopener,noreferrer')
    },
  },
  {
    icon: <LinkIcon />,
    label: 'Link',
    onClick: () => {
      const currentURL = window.location.href
      navigator.clipboard
        .writeText(currentURL)
        .then(() => {
          toast.success('已複製文章網址')
        })
        .catch(() => {
          toast.error('複製文章網址失敗')
        })
    },
  },
]
