'use client'
import Link from 'next/link'
import { useState } from 'react'
import styled from 'styled-components'

import {
  Color,
  KIDS_URL_ORIGIN,
  NEWSLETTER_SUBSCRIPTION,
  PRIVACY_POLICY,
} from '@/constants'
import { Arrow, Mailbox, MailboxWithArrow } from '@/icons/miscellaneous'

const SVGIcon = styled.svg<{ src: string }>`
  height: 24px;
  width: 24px;
  mask-image: url(${(props) => props.src});
  mask-size: cover;
`

const Divider = styled.div`
  border: 1px solid ${Color.LIGHT_GRAY};
  margin-left: 16px;
  margin-right: 16px;
`

enum LoginStep {
  INITIAL,
  ENTER_EMAIL,
  ENTER_OTP,
  SUBSCRIBE_NEWSLETTER,
  LOADING,
}

const LoginBtn = (props: {
  children?: React.ReactNode
  onClick: () => void
}) => {
  return (
    <div
      className="flex flex-row items-center justify-center gap-1 rounded-full border border-2 bg-white p-3 hover:cursor-pointer hover:bg-gray-100"
      onClick={props.onClick}
    >
      {props.children}
    </div>
  )
}

const LoginTemplateComponent = (
  TitleComponent: React.ReactNode,
  hint: string,
  hintHref: string
) => {
  const TemplateComponent = () => {
    const [step, setStep] = useState(LoginStep.INITIAL)
    const [email, setEmail] = useState('')
    const [otp, setOTP] = useState('')

    const isInvalidOTP = otp !== ''

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value)
    }

    const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setOTP(e.target.value)
    }

    const loginBtns = (
      <>
        {TitleComponent}
        <div className="flex w-72 flex-col gap-4">
          <LoginBtn
            onClick={() => {
              console.log('google')
            }}
          >
            <img alt="google" src="/assets/images/google.svg" />
            <span className="text-base font-bold">使用Google帳號</span>
          </LoginBtn>
          <LoginBtn
            onClick={() => {
              console.log('fb')
            }}
          >
            <SVGIcon
              style={{ backgroundColor: 'rgb(66, 103, 178)' }}
              src={'/assets/images/facebook.svg'}
            />
            <span className="text-base font-bold">使用Facebook帳號</span>
          </LoginBtn>
          <LoginBtn
            onClick={() => {
              setStep(LoginStep.ENTER_EMAIL)
            }}
          >
            <SVGIcon
              style={{ backgroundColor: 'rgb(64, 64, 64)' }}
              src={'/assets/images/letter.svg'}
            />
            <span className="text-base font-bold">使用電子信箱</span>
          </LoginBtn>
        </div>
        <Link
          style={{ color: '#1A7AEB' }}
          className="mt-12 mb-16 text-sm underline-offset-2 hover:underline"
          href={hintHref}
        >
          {hint}
        </Link>
        <span style={{ color: Color.FONT_GRAY }} className="text-sm">
          完成帳號登入代表你同意我們的
          <a className="underline" href={PRIVACY_POLICY}>
            隱私權政策
          </a>
        </span>
      </>
    )

    const enterEmail = (
      <div className="flex w-72 flex-col items-center justify-center">
        <div
          style={{ backgroundColor: '#f1f1f1' }}
          className="mb-6 flex h-16 w-16 flex-col items-center justify-center rounded-full"
        >
          {Mailbox}
        </div>
        <span style={{ fontSize: '28px' }} className="mb-2 font-bold">
          輸入電子信箱
        </span>
        <span
          style={{ color: Color.FONT_GRAY, fontSize: '16px' }}
          className="mb-10"
        >
          我們會將驗證碼寄送給您
        </span>
        <input
          className="mx-1 mb-10 w-full border-b-2 border-gray-400 bg-white py-2 text-center placeholder-gray-300 focus:outline-hidden"
          placeholder="example@mail.com"
          value={email}
          onChange={handleEmailChange}
        ></input>
        <button
          className="mb-6 w-full rounded-full bg-[#404040] py-2 hover:bg-black"
          style={{ color: 'white' }}
          onClick={() => {
            setStep(LoginStep.ENTER_OTP)
          }}
        >
          確認
        </button>
        <button
          className="flex flex-row items-center justify-center gap-2 text-[#808080] hover:text-[#404040]"
          onClick={() => {
            setStep(LoginStep.INITIAL)
          }}
        >
          {Arrow}
          其他登入方式
        </button>
      </div>
    )

    const enterOTP = (
      <div className="flex w-72 flex-col items-center justify-center">
        <div
          style={{ backgroundColor: '#f1f1f1' }}
          className="mb-6 flex h-16 w-16 flex-col items-center justify-center rounded-full"
        >
          {MailboxWithArrow}
        </div>
        <span style={{ fontSize: '28px' }} className="mb-2 font-bold">
          輸入驗證碼
        </span>
        <span
          style={{ color: Color.FONT_GRAY, fontSize: '16px' }}
          className="mb-10"
        >
          已將驗證碼寄到
          <br />
          user@mail.com
        </span>
        <input
          style={{
            fontFamily: 'Roboto Slab',
            fontWeight: '400',
            lineHeight: '36px',
            letterSpacing: '0.25em',
            borderColor: isInvalidOTP ? '#F56977' : 'rgb(156 163 175)',
          }}
          className="mx-1 mb-2 w-full border-b-2 bg-white py-2 text-center text-2xl placeholder-gray-300 focus:outline-hidden"
          value={otp}
          onChange={handleOTPChange}
        />
        <span
          style={{
            color: isInvalidOTP ? '#F56977' : Color.DARK_GRAY,
            fontSize: '12px',
          }}
          className="mb-10"
        >
          {isInvalidOTP ? '驗證碼錯誤，請重新輸入' : '請在15分鐘內輸入'}
        </span>
        <button
          className="mb-6 w-full rounded-full bg-[#404040] py-2 hover:bg-black"
          style={{ color: 'white' }}
          onClick={() => {
            setStep(LoginStep.SUBSCRIBE_NEWSLETTER)
          }}
        >
          確認
        </button>
        <button
          className="flex flex-row items-center justify-center gap-2"
          style={{ color: '#1A7AEB' }}
          onClick={() => {
            console.log('resend')
          }}
        >
          再寄一次驗證碼
        </button>
      </div>
    )

    const subscribeNewsletter = (
      <div className="mx-6 flex flex-col items-center justify-center">
        <div className="mb-8 flex max-w-96 flex-col rounded-lg border border-gray-200">
          <span
            style={{ fontSize: '22px' }}
            className="mx-4 my-6 block text-center font-bold"
          >
            註冊成功
            <br />
            現在訂閱電子報
          </span>
          <Divider />
          <div className="mx-4 mt-10 flex flex-col md:mx-11">
            <div className="mb-1 flex flex-row items-center justify-start gap-2">
              <span style={{ fontSize: '16px' }} className="font-bold">
                報導仔新聞聯絡簿
              </span>
              <div
                style={{
                  color: '#F76977',
                  background: '#F1F1F1',
                  padding: '2px 4px',
                  fontSize: '14px',
                }}
              >
                每月
              </div>
            </div>
            <span
              style={{ color: Color.FONT_GRAY, fontSize: '14px' }}
              className="mb-14"
            >
              兒少新聞平台《少年報導者》的最新專題和活動消息，就讓可愛的報導仔來告訴你！
            </span>
          </div>
        </div>
        <Link
          className="mb-6 w-44 rounded-full bg-[#404040] py-2 text-center font-bold hover:bg-black"
          style={{ color: 'white' }}
          href={NEWSLETTER_SUBSCRIPTION}
        >
          前往訂閱
        </Link>
        <Link
          style={{ color: Color.FONT_GRAY, fontSize: '14px' }}
          className="underline underline-offset-2"
          href={KIDS_URL_ORIGIN}
        >
          不訂閱，回首頁
        </Link>
      </div>
    )

    const loading = (
      <div className="flex flex-col items-center justify-center">
        <span>請稍候</span>
      </div>
    )

    return (
      <div className="flex w-full flex-col items-center justify-center">
        {step === LoginStep.INITIAL && loginBtns}
        {step === LoginStep.ENTER_EMAIL && enterEmail}
        {step === LoginStep.ENTER_OTP && enterOTP}
        {step === LoginStep.SUBSCRIBE_NEWSLETTER && subscribeNewsletter}
        {step === LoginStep.LOADING && loading}
      </div>
    )
  }
  return TemplateComponent
}

export const LoginComponent = LoginTemplateComponent(
  <span style={{ fontSize: '28px' }} className="mb-16 font-bold">
    登入
  </span>,
  '我還沒有帳號，現在去註冊',
  '/register'
)

export const RegisterComponent = LoginTemplateComponent(
  <>
    <span style={{ fontSize: '28px' }} className="mb-2 font-bold">
      註冊
    </span>
    <span
      style={{ color: Color.DARK_GRAY }}
      className="mb-16 block text-center text-base"
    >
      免費獲得電子報
      <br />
      儲存喜愛的深度報導
    </span>
  </>,
  '已經有帳號了，我要登入',
  '/login'
)
