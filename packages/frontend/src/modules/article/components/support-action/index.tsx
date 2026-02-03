'use client'

import { Button } from '@kids-reporter/routing-ui'
import Link from 'next/link'

import { DONATE_URL } from '@/constants'

import TriangleIllustrations from './triangle-illustrations'

function SupportAction() {
  return (
    <div className="relative mx-auto w-full max-w-screen overflow-hidden bg-yellow-100">
      <div className="relative w-full">
        <TriangleIllustrations />

        <div className="relative z-10 flex flex-col items-center justify-center px-14 py-12 tablet:px-12 desktop:px-16 desktop:py-16">
          <div className="flex w-full max-w-[510px] flex-col hd:max-w-[584px]">
            <div className="flex flex-col gap-4">
              <h3 className="text-center prose-h3-small font-swei text-neutral-900 desktop:prose-h3-large">
                每一篇好報導，都需要有心人支持
              </h3>
              <p className="prose-p1 text-neutral-900">
                《少年報導者》的文章都經由文字記者採訪撰寫、攝影記者拍攝照片、美術設計圖像及圖表、編輯編排版面，再由核稿主管及審閱專家做檢視，一篇負責的報導常常投入多達5、6個專業人員。有時我們和重大的突發事件賽跑，必須即刻完成；有時我們必須尋找關鍵的人物與證據，費時數月。
                <br />
                <br />
                一篇好的兒少新聞報導，需要像您一樣的讀者以行動支持，才得以產生。
                <br />
                <br />
                支持兒少獨立媒體，成為《少年報導者》贊助天使！
              </p>
            </div>
            <Button
              variant="primary"
              size={44}
              asChild
              className="mx-auto mt-8 w-[115px]"
            >
              <Link href={DONATE_URL} target="_blank" rel="noopener noreferrer">
                前往贊助
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupportAction
