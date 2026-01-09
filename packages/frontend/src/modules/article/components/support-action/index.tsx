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
                《少年報導者》的文章內容，都經由文字記者第一手的採訪撰寫、攝影記者拍攝照片、美術設計進行圖像及圖表設計、責任編輯做版面編排，再由核稿主管及審閱專家做內容檢視。一篇負責的報導，由採訪、編排到核實，有時多達5、6個專業人員的人力與心血投入，有時我們和重大的突發事件賽跑，一天內就必須完成；有時我們必須搜集完整的資料、尋找關鍵的人物與證據，費時數月才能完成。
                <br />
                <br />
                一篇好的兒少新聞報導，需要靠像您一樣的讀者以行動支持，才得以產生；而您捐助的每一塊錢，如何被運用，也都在公開透明呈現在我們的網站上。
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
