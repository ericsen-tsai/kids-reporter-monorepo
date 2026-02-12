import Image from 'next/image'

import WaveIllustrations from './wave-illustrations'

function Intro() {
  return (
    <section
      id="mission"
      className="relative w-full max-w-300 scroll-margin-anchor bg-neutral-white"
    >
      <div className="relative z-1 flex w-full flex-col gap-6 px-6 pt-6 pb-[45.5px] tablet:flex-row tablet:items-center tablet:justify-center tablet:px-8 tablet:pt-8 tablet:pb-[85px] desktop:items-center desktop:gap-8 desktop:px-12 desktop:pt-12 desktop:pb-[90px] hd:translate-x-[55px] hd:gap-22 hd:pt-16 hd:pb-26.5">
        <div className="flex w-full flex-1 flex-col gap-3 tablet:ml-8 desktop:ml-12 hd:-mt-px hd:ml-0 hd:max-w-120">
          <h1 className="prose-h2-small font-swei! text-neutral-900 desktop:prose-h2-large hd:prose-h1-large">
            理解世界,參與未來
          </h1>
          <p className="prose-p1 text-neutral-700">
            《少年報導者》是由非營利媒體《報導者》為10～15歲的同學打造的新聞平台，不僅製作深度報導，也提供公共參與的管道，每一篇文章都是記者獨立採訪、專家審核把關下完成。我們把每個兒童和少年當成獨立的大人，讓兒少不只是新聞的探索者、議題的提問者、更可以是發動改變的倡議者。
          </p>
        </div>

        <div className="relative shrink-0">
          <Image
            src="/assets/images/about/intro/illustration.svg"
            alt="少年報導者介紹圖"
            className="relative top-0 left-0 mx-auto h-[273px] w-[327px] max-w-120 tablet:top-[calc((100vw-768px)*0.15)] tablet:h-[284px] tablet:w-[340px] desktop:top-[calc((100vw-1024px)*0.08)] desktop:h-[374px] desktop:w-[448px] hd:top-[calc((100vw-1440px)*0.05)] hd:h-[400px] hd:w-[480px]"
            loading="eager"
            width={327}
            height={273}
            priority
          />
        </div>
      </div>

      <WaveIllustrations />
    </section>
  )
}

export default Intro
