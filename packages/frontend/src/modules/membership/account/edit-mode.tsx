'use client'
import { Input } from '@kids-reporter/routing-ui'
import { Controller, useFormContext } from 'react-hook-form'

import Divider from '@/components/divider'
import { getFormattedDate } from '@/utils/get-formatted-date'

import { AccountFormData } from '../types'

type EditModeProps = {
  id: string
  joinedAt: string
}

function EditMode({ id, joinedAt }: EditModeProps) {
  const { control } = useFormContext<AccountFormData>()
  return (
    <div className="flex w-full flex-col gap-5 desktop:gap-6">
      {/* Full Name */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <div className="flex w-full flex-col gap-1">
            <span className="prose-p1-bold text-neutral-900">全名</span>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  placeholder="請輸入全名"
                  error={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  id={field.name}
                />
              )}
            />
          </div>
        </div>
      </div>

      <Divider />

      {/* Nickname */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <div className="flex w-full flex-col gap-1">
            <span className="prose-p1-bold text-neutral-900">暱稱</span>
            <Controller
              name="nickname"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  placeholder="請輸入暱稱"
                  error={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  id={field.name}
                />
              )}
            />
          </div>
        </div>
      </div>

      <Divider />

      {/* Member Account - Disabled */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <div className="flex w-full flex-col gap-1">
            <span className="prose-p1-bold text-neutral-900">會員帳號</span>
            <span id="member-account-desc" className="sr-only">
              會員帳號無法編輯
            </span>
            <Input
              value={id}
              placeholder={id}
              disabled
              className="w-full rounded-xl border border-neutral-400 bg-neutral-100 desktop:bg-neutral-100!"
              aria-describedby="member-account-desc"
            />
          </div>
        </div>
      </div>

      <Divider />

      {/* Contact Email */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <div className="flex w-full flex-col gap-1">
            <span className="prose-p1-bold text-neutral-900">聯絡信箱</span>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  placeholder="請輸入聯絡信箱"
                  error={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  id={field.name}
                />
              )}
            />
          </div>
        </div>
      </div>

      <Divider />

      {/* Join Date - Disabled */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <div className="flex w-full flex-col gap-1">
            <span className="prose-p1-bold text-neutral-900">加入日期</span>
            <span id="join-date-desc" className="sr-only">
              加入日期無法編輯
            </span>
            <Input
              value={getFormattedDate(joinedAt, '/')}
              placeholder={getFormattedDate(joinedAt, '/')}
              disabled
              className="w-full rounded-xl border border-neutral-400 bg-neutral-100 desktop:bg-neutral-100!"
              aria-describedby="join-date-desc"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditMode
