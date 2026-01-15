import Image from 'next/image'

function WaveIllustrations() {
  return (
    <>
      <div className="absolute bottom-0 left-0 z-1 h-[116px] w-full tablet:hidden">
        <Image
          src="/assets/images/home/topic_wave_back_s.svg"
          alt="topic wave back"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
      <div className="absolute bottom-0 left-0 z-3 h-[104px] w-full tablet:hidden">
        <Image
          src="/assets/images/home/topic_wave_front_s.svg"
          alt="topic wave front"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
      <div
        className="absolute bottom-0 left-1/2 z-1 hidden h-[120px] w-full -translate-x-1/2 bg-[url(/assets/images/home/topic_wave_back_m.svg)] bg-[length:768px_120px] bg-center bg-repeat-x tablet:block desktop:hidden"
        aria-label="topic wave back"
      />
      <div
        className="absolute -bottom-2 left-1/2 z-3 hidden h-[120px] w-full -translate-x-1/2 bg-[url(/assets/images/home/topic_wave_front_m.svg)] bg-[length:768px_120px] bg-center bg-repeat-x tablet:block desktop:hidden"
        aria-label="topic wave front"
      />
      <div
        className="absolute bottom-0 left-1/2 z-1 hidden h-[160px] w-full -translate-x-1/2 bg-[url(/assets/images/home/topic_wave_back_l.svg)] bg-[length:1024px_160px] bg-center bg-repeat-x desktop:block hd:hidden"
        aria-label="topic wave back"
      />
      <div
        className="absolute -bottom-2 left-1/2 z-3 hidden h-[160px] w-full -translate-x-1/2 bg-[url(/assets/images/home/topic_wave_front_l.svg)] bg-[length:1024px_160px] bg-center bg-repeat-x desktop:block hd:hidden"
        aria-label="topic wave front"
      />
      <div
        className="absolute bottom-0 left-1/2 z-1 hidden h-[240px] w-full -translate-x-1/2 bg-[url(/assets/images/home/topic_wave_back_xl.svg)] bg-[length:1440px_240px] bg-center bg-repeat-x hd:block"
        aria-label="topic wave back"
      />
      <div
        className="absolute bottom-0 left-1/2 z-3 hidden h-[200px] w-full -translate-x-1/2 bg-[url(/assets/images/home/topic_wave_front_xl.svg)] bg-[length:1440px_200px] bg-center bg-repeat-x hd:block"
        aria-label="topic wave front"
      />
    </>
  )
}

export default WaveIllustrations
