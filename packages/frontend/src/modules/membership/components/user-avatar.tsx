import Image from 'next/image'

type UserAvatarProps = {
  avatar: string
  name: string
}

function UserAvatar({ avatar, name }: UserAvatarProps) {
  return (
    <div className="relative size-[136px] overflow-hidden rounded-full desktop:size-[168px]">
      <Image
        src={avatar}
        alt={name}
        className="size-full bg-white object-cover"
        fill
      />
    </div>
  )
}

export default UserAvatar
