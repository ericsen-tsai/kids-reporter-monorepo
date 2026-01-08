'use client'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { DEFAULT_AVATAR } from '@/constants'
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/constants/input-field'
import { EditPenIcon } from '@/icons'

import { AccountFormData } from '../types'

type EditUserAvatarProps = {
  name: string
  onFileSelect?: (file: File) => void
}

function EditUserAvatar({ name, onFileSelect }: EditUserAvatarProps) {
  const { control, setError, clearErrors } = useFormContext<AccountFormData>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const objectUrlRef = useRef<string | null>(null)

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onFieldChange: (value: string) => void
  ) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError('avatarUrl', {
        message: '不支援的檔案格式',
      })
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError('avatarUrl', {
        message: '檔案大小超過限制，請上傳小於 5MB 的圖片',
      })
      return
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
    }
    const previewUrl = URL.createObjectURL(file)
    objectUrlRef.current = previewUrl
    onFieldChange(previewUrl)
    clearErrors('avatarUrl')
    onFileSelect?.(file)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }
    }
  }, [])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Controller
      name="avatarUrl"
      control={control}
      render={({ field, fieldState }) => {
        const avatarUrl = field.value || ''

        return (
          <div className="relative">
            <div className="relative size-[136px] overflow-hidden rounded-full border-2 border-neutral-200 desktop:size-[168px]">
              <Image
                src={avatarUrl || DEFAULT_AVATAR}
                alt={name || 'default avatar'}
                className="size-full bg-white object-cover"
                fill
                sizes="(max-width: 1024px) 136px, 168px"
              />
            </div>
            <div className="absolute right-1 bottom-1 z-100 flex size-9 items-center justify-center rounded-full bg-white shadow desktop:size-11">
              <button
                type="button"
                onClick={handleAvatarClick}
                className="relative flex size-full cursor-pointer items-center justify-center text-neutral-500 hover:text-red-400"
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
            {fieldState.error && (
              <p
                className="absolute top-[calc(100%+4px)] left-1/2 w-full -translate-x-1/2 text-center prose-p3 text-semantic-danger"
                id="avatar-error"
                role="alert"
              >
                {fieldState.error.message}
              </p>
            )}
          </div>
        )
      }}
    />
  )
}

export default EditUserAvatar
