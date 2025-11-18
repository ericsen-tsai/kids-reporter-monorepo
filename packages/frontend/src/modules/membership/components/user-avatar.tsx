import Image from 'next/image'

import { DEFAULT_AVATAR } from '@/constants'

type UserAvatarProps = {
  avatar: string
  name: string
}

function UserAvatar({ avatar, name }: UserAvatarProps) {
  return (
    <div className="relative size-[136px] overflow-hidden rounded-full border-2 border-neutral-200 desktop:size-[168px]">
      <Image
        src={avatar || DEFAULT_AVATAR}
        alt={name || 'default avatar'}
        className="size-full bg-white object-cover"
        fill
        sizes="(max-width: 1024px) 136px, 168px"
      />
    </div>
  )
}

export default UserAvatar
