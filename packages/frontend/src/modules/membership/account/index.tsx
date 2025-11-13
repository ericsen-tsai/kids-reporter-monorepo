'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  HeaderMobileBackButtonHrefSetter,
} from '@kids-reporter/routing-ui'
import { useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import MembershipSideMenu from '../components/side-menu'
import UserAvatar from '../components/user-avatar'
import { MOCK_USER } from '../constants'
import { AccountFormData, accountFormSchema } from '../types'
import EditMode from './edit-mode'
import EditUserAvatar from './edit-user-avatar'
import ViewMode from './view-mode'

const defaultValues: AccountFormData = {
  name: MOCK_USER.name,
  nickname: MOCK_USER.nickname,
  email: MOCK_USER.email,
  avatar: MOCK_USER.avatar,
}

function Account() {
  const [isEditMode, setIsEditMode] = useState(false)

  const methods = useForm<AccountFormData>({
    resolver: zodResolver(accountFormSchema),
    values: defaultValues,
    resetOptions: {
      keepValues: true,
    },
  })

  const { handleSubmit, reset } = methods

  const handleEdit = () => {
    setIsEditMode(true)
  }

  const handleFormSubmit = useCallback(
    () => handleSubmit((data) => console.log(data))(),
    [handleSubmit]
  )

  const handleCancel = () => {
    setIsEditMode(false)
    reset(defaultValues)
  }

  return (
    <FormProvider {...methods}>
      <div className="mx-auto w-full bg-neutral-100 pt-6 pb-40 tablet:pt-8 desktop:px-12 desktop:pt-16 desktop:pb-50">
        <div className="mx-auto w-full max-w-300 tablet:grid tablet:grid-cols-12">
          <HeaderMobileBackButtonHrefSetter href="/member" />
          <div className="hidden tablet:col-span-2 tablet:block tablet:min-w-[150px] desktop:pr-8">
            <MembershipSideMenu />
          </div>
          <div className="flex w-full gap-9 tablet:col-span-10 hd:gap-13">
            <div className="flex flex-1 flex-col px-6 tablet:px-8 desktop:px-0">
              <div className="mb-6 flex items-center justify-between desktop:mb-8">
                <h1 className="prose-h4-large font-family-swei text-neutral-900">
                  個人資料
                </h1>
                {isEditMode ? (
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size={32}
                      onClick={handleCancel}
                    >
                      取消
                    </Button>
                    <Button
                      variant="primary"
                      size={32}
                      onClick={handleFormSubmit}
                    >
                      儲存
                    </Button>
                  </div>
                ) : (
                  <Button variant="primary" size={32} onClick={handleEdit}>
                    編輯
                  </Button>
                )}
              </div>

              <div className="mb-5 flex w-full items-center justify-center tablet:hidden">
                {isEditMode ? (
                  <EditUserAvatar name={MOCK_USER.name} />
                ) : (
                  <UserAvatar avatar={MOCK_USER.avatar} name={MOCK_USER.name} />
                )}
              </div>

              {isEditMode ? (
                <EditMode id={MOCK_USER.id} joinedAt={MOCK_USER.joinedAt} />
              ) : (
                <ViewMode
                  name={MOCK_USER.name}
                  nickname={MOCK_USER.nickname}
                  id={MOCK_USER.id}
                  email={MOCK_USER.email}
                  joinedAt={MOCK_USER.joinedAt}
                />
              )}
            </div>
            <div className="mt-[70px] hidden tablet:mr-8 tablet:block desktop:mt-[78px] desktop:mr-0">
              {isEditMode ? (
                <EditUserAvatar name={MOCK_USER.name} />
              ) : (
                <UserAvatar avatar={MOCK_USER.avatar} name={MOCK_USER.name} />
              )}
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  )
}

export default Account
