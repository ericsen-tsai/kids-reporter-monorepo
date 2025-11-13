'use client'
import Image from 'next/image'
import { useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { DEFAULT_AVATAR } from '@/constants'
import { EditPenIcon } from '@/icons'

import { AccountFormData } from '../types'

type EditUserAvatarProps = {
  name: string
}

function EditUserAvatar({ name }: EditUserAvatarProps) {
  const { control } = useFormContext<AccountFormData>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onFieldChange: (value: string) => void
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      onFieldChange(previewUrl)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Controller
      name="avatar"
      control={control}
      render={({ field }) => {
        const avatarUrl = field.value || ''

        return (
          <div className="relative">
            <div className="relative size-[136px] overflow-hidden rounded-full desktop:size-[168px]">
              <Image
                src={avatarUrl || DEFAULT_AVATAR}
                alt={name}
                className="size-full bg-white object-cover"
                fill
              />
            </div>
            <div className="absolute right-1 bottom-1 z-100 flex size-9 items-center justify-center rounded-full bg-white shadow desktop:size-11">
              <button
                type="button"
                onClick={handleAvatarClick}
                className="relative flex size-full cursor-pointer items-center justify-center"
                aria-label="上傳頭像"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, field.onChange)}
                  className="hidden"
                  aria-label="選擇頭像圖片"
                />
                <EditPenIcon />
              </button>
            </div>
          </div>
        )
      }}
    />
  )
}

export default EditUserAvatar
