'use client'
import Link from 'next/link'
import { useRef, useState } from 'react'
import styled from 'styled-components'

import {
  Color,
  KIDS_URL_ORIGIN,
  NEWSLETTER_PREVIEW,
  NEWSLETTER_SUBSCRIPTION,
  ThemeColor,
} from '@/constants'

import { Checkbox, ToggleButton } from './basic-component'

enum Tab {
  INFO,
  MY_READINGS,
  SETTINGS,
  SUBSCRIBE_NEWSLETTER,
}

export type AccountSettings = {
  info: { label: string; value: string }[]
  settings: any
}

const SVGIcon = styled.svg<{ src: string }>`
  height: 24px;
  width: 24px;
  mask-image: url(${(props) => props.src});
  mask-size: cover;
`

const Title = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: #232323;
  margin-bottom: 32px;
`

const SubTitle = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #232323;
  letter-spacing: 0.05em;
  line-height: 25.6px;
`

const Description = styled.span`
  font-size: 16px;
  color: #575757;
  letter-spacing: 0.05em;
  line-height: 25.6px;
`

const Divider = styled.div`
  width: 100%;
  border: 1px solid ${Color.LIGHT_GRAY};
  margin-bottom: 20px;
  margin-top: 24px;
`

const isQAsEnabled = Array(3).fill(false)

export const AccountTabs = (props: { accoutSettings: AccountSettings }) => {
  const accountSettings = props.accoutSettings
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [tab, setTab] = useState(Tab.INFO)
  const [isGuideEnabled, setIsGuideEnabled] = useState(
    accountSettings.settings.isGuideEnabled
  )
  const [isQAEnabled, setIsQAEnabled] = useState(
    accountSettings.settings.qa.isQAEnabled
  )
  const [isRecommendationEnabled, setIsRecommendationEnabled] = useState(
    accountSettings.settings.isRecommendationEnabled
  )

  const handleAvatarFileChange = () => {
    console.log('select avatar file')
  }

  const panelBtns = (
    <div className="flex w-full flex-col items-start md:w-48">
      <button
        className="w-full px-4 py-1.5 text-left text-base hover:bg-gray-200 active:bg-gray-300"
        style={{
          color: tab === Tab.INFO ? ThemeColor.BLUE : '#232323',
        }}
        onClick={() => {
          setTab(Tab.INFO)
        }}
      >
        個人資料
      </button>
      {/* Temporarily disabled features */}
      {/* {false && (
        <button
          className="w-full text-left text-base hover:bg-gray-200 active:bg-gray-300 px-4 py-1.5"
          style={{
            color: tab === Tab.MY_READINGS ? ThemeColor.BLUE : '#232323',
          }}
          onClick={() => {
            setTab(Tab.MY_READINGS)
          }}
        >
          我的閱讀
        </button>
      )}
      {false && (
        <button
          className="w-full text-left text-base hover:bg-gray-200 active:bg-gray-300 px-4 py-1.5"
          style={{
            color: tab === Tab.SETTINGS ? ThemeColor.BLUE : '#232323',
          }}
          onClick={() => {
            setTab(Tab.SETTINGS)
          }}
        >
          閱讀設定
        </button>
      )} */}
      <button
        className="w-full px-4 py-1.5 text-left text-base hover:bg-gray-200 active:bg-gray-300"
        style={{
          color: tab === Tab.SUBSCRIBE_NEWSLETTER ? ThemeColor.BLUE : '#232323',
        }}
        onClick={() => {
          setTab(Tab.SUBSCRIBE_NEWSLETTER)
        }}
      >
        訂閱電子報
      </button>
      <Divider />
      <Link
        className="w-full px-4 py-1.5 text-left text-base hover:bg-gray-200 active:bg-gray-300"
        href={'/logout'}
      >
        登出
      </Link>
    </div>
  )

  const infoTab = (
    <div className="flex grow flex-col items-start justify-center">
      <div className="flex w-full flex-col-reverse items-center justify-center gap-8 md:flex-row md:items-stretch md:justify-start">
        <div className="flex w-full grow flex-col items-start justify-center lg:max-w-3xl">
          <Title>個人資料</Title>
          {accountSettings?.info?.map((info, index) => {
            return (
              <>
                <div
                  key={`account-field-${index}`}
                  className="flex flex-row items-center justify-center"
                >
                  <span style={{ width: '120px', color: '#575757' }}>
                    {info?.label}
                  </span>
                  <span>{info?.value}</span>
                </div>
                {index < accountSettings?.info?.length - 1 && <Divider />}
              </>
            )
          })}
        </div>
        <div className="relative flex w-36 min-w-36 flex-col justify-end lg:w-40 lg:min-w-40">
          <img src={'/assets/images/avatar_bg.png'} />
          <div
            className="absolute right-0 flex h-9 w-9 cursor-pointer flex-row items-center justify-center rounded-full bg-white lg:h-11 lg:w-11"
            style={{ boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.2)' }}
            onClick={() => fileInputRef?.current?.click()}
          >
            <SVGIcon
              className={'bg-[#A3A3A3] hover:bg-[#27B5F7]'}
              src={'/assets/images/editpen.svg'}
            />
          </div>
          <input
            onChange={handleAvatarFileChange}
            multiple={false}
            ref={fileInputRef}
            type="file"
            hidden
          />
        </div>
      </div>
    </div>
  )

  const myReadingsTab = <div></div>

  const settingsTab = (
    <div className="flex w-full flex-col items-start justify-center lg:max-w-4xl">
      <Title>閱讀設定</Title>
      <div className="flex w-full flex-row gap-6">
        <div className="flex grow flex-col">
          <SubTitle>文章前引導</SubTitle>
          <Description>
            在每篇文章的起始處，加入能引起小讀者興趣的元件，在開場就抓住他的注意力！
          </Description>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span>
            {accountSettings.settings.isGuideEnabled ? '開啟' : '關閉'}
          </span>
          <ToggleButton
            value={isGuideEnabled}
            onChange={() => {
              setIsGuideEnabled(!isGuideEnabled)
            }}
          />
        </div>
      </div>
      <Divider />
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-row gap-6">
          <div className="flex grow flex-col">
            <SubTitle>文章後QA</SubTitle>
            <Description>
              在每篇文章的結尾處，加入思辨題或選擇題，透過答題互動來強化小讀者的吸收。
            </Description>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span>
              {accountSettings.settings.qa.isQAEnabled ? '開啟' : '關閉'}
            </span>
            <ToggleButton
              value={isQAEnabled}
              onChange={() => {
                setIsQAEnabled(!isQAEnabled)
              }}
            />
          </div>
        </div>
        <div
          className="mt-4 flex flex-col gap-2 rounded-2xl px-6 py-5"
          style={{ background: Color.BORDER_GRAY }}
        >
          <SubTitle>思辨題數量</SubTitle>
          <div className="flex flex-row gap-6">
            <Checkbox checked={true} label={'無'} />
            {isQAsEnabled.map((isEnabled, index) => {
              return (
                <Checkbox
                  key={`qa-checkbox-${index}`}
                  checked={isEnabled}
                  label={`${index + 1}題`}
                />
              )
            })}
          </div>
        </div>
      </div>
      <Divider />
      <div className="flex w-full flex-row gap-6">
        <div className="flex grow flex-col items-start">
          <SubTitle>推薦《報導者》相關文章</SubTitle>
          <Description>
            針對思辨能力較強的小讀者，推薦與文章主題相關的《報導者》文章。
          </Description>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span>
            {accountSettings.settings.isRecommendationEnabled ? '開啟' : '關閉'}
          </span>
          <ToggleButton
            value={isRecommendationEnabled}
            onChange={() => {
              setIsRecommendationEnabled(!isRecommendationEnabled)
            }}
          />
        </div>
      </div>
    </div>
  )

  const subscribeNewsletterTab = (
    <div className="flex flex-col items-start justify-center">
      <Title>訂閱電子報</Title>
      <div className="flex max-w-4xl flex-row items-start justify-center rounded-3xl border-2 p-8">
        <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
            <img src="/assets/images/kids_newsletter_subscription.png" />
            <div className="flex flex-col items-start justify-center gap-1">
              <div className="flex flex-row items-center justify-start gap-0.5 md:gap-2">
                <SubTitle style={{ fontSize: '18px' }}>
                  報導仔新聞聯絡簿
                </SubTitle>
                <div
                  style={{
                    color: ThemeColor.BLUE,
                    background: '#F1F1F1',
                    padding: '2px 4px',
                  }}
                >
                  每月
                </div>
              </div>
              <span style={{ color: '#4A4A4A' }}>
                兒少新聞平台
                <a
                  style={{ textDecoration: 'underline', color: '#8E8E8E' }}
                  href={KIDS_URL_ORIGIN}
                >
                  《少年報導者》
                </a>
                的最新專題和活動消息，就讓可愛的報導仔來告訴你！
              </span>
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-4">
            <Link
              style={{
                fontWeight: '700',
                borderColor: ThemeColor.BLUE,
                borderWidth: '2px',
              }}
              className="rounded-full px-5 py-3 text-base text-nowrap md:px-10 md:text-lg"
              href={NEWSLETTER_PREVIEW}
            >
              預覽
            </Link>
            <Link
              style={{
                fontWeight: '700',
                color: 'white',
                background: ThemeColor.BLUE,
              }}
              className="rounded-full px-5 py-3 text-base text-nowrap md:px-10 md:text-lg"
              href={NEWSLETTER_SUBSCRIPTION}
            >
              前往訂閱
            </Link>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div
      style={{
        width: 'var(--container-width)',
        maxWidth: 'var(--normal-container-max-width)',
      }}
      className="mt-16 flex flex-col-reverse items-start justify-start gap-16 md:flex-row md:gap-8"
    >
      {panelBtns}
      <div className="w-full grow">
        {tab === Tab.INFO && infoTab}
        {tab === Tab.MY_READINGS && myReadingsTab}
        {tab === Tab.SETTINGS && settingsTab}
        {tab === Tab.SUBSCRIBE_NEWSLETTER && subscribeNewsletterTab}
      </div>
    </div>
  )
}
