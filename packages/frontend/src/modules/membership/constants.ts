import { DEFAULT_AVATAR } from '@/constants'

export const MEMBERSHIP_MENU_ITEMS = [
  { label: '個人資料', href: '/account' },
  { label: '我的回答', href: '/myreading' },
  { label: '閱讀設定', href: '/custom' },
  { label: '訂閱電子報', href: '/email-subscription' },
]

export const MOCK_USER = {
  name: '孫小美',
  id: 'xxxx-xxxx-xxxx-xxxx',
  avatar: DEFAULT_AVATAR,
  nickname: '小美',
  email: 'test@test.com',
  joinedAt: '2024-01-01',
}
