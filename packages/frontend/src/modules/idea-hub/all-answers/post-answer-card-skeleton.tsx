function QuestionAnswerSkeleton() {
  return (
    <div className="z-10 flex w-full flex-col gap-4 overflow-hidden rounded-2xl bg-neutral-white">
      <div className="flex w-full flex-col gap-2 bg-neutral-200 px-4 pt-4 pb-4">
        <div className="h-6 w-full animate-pulse rounded bg-neutral-300" />
        <div className="h-6 w-[200px] animate-pulse rounded bg-neutral-300" />
      </div>
      <div className="flex w-full flex-col gap-4 px-4 pb-4">
        <div className="flex items-center gap-3">
          <div className="size-10 flex-shrink-0 animate-pulse rounded-full bg-neutral-300" />
          <div className="h-[25px] w-14 animate-pulse rounded bg-neutral-300" />
        </div>
        <div className="flex flex-col gap-2 border-b border-neutral-300 pb-4">
          <div className="h-6 w-full animate-pulse rounded bg-neutral-300" />
          <div className="h-6 w-[200px] animate-pulse rounded bg-neutral-300" />
        </div>
        <div className="flex items-center gap-3">
          <div className="size-10 flex-shrink-0 animate-pulse rounded-full bg-neutral-300" />
          <div className="h-[25px] w-14 animate-pulse rounded bg-neutral-300" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-6 w-full animate-pulse rounded bg-neutral-300" />
          <div className="h-6 w-[200px] animate-pulse rounded bg-neutral-300" />
        </div>
        <div className="mx-auto flex items-center gap-1">
          <div className="h-6 w-14 animate-pulse rounded bg-gradient-to-r from-neutral-300 to-white" />
        </div>
      </div>
    </div>
  )
}

function PostAnswerCardSkeleton() {
  return (
    <div className="relative flex w-[300px] flex-col gap-4 overflow-hidden rounded-2xl bg-neutral-100 shadow-[0px_0px_3px_0px_rgba(0,0,0,0.12)] tablet:w-[336px] desktop:w-[400px] hd:w-[440px]">
      <div className="absolute z-1 h-60 w-full bg-neutral-700 opacity-30 backdrop-blur-[4px]">
        <div
          className="absolute bottom-0 z-1 h-12 w-full desktop:h-14"
          style={{
            background:
              'linear-gradient(0deg, #F8F8F8 0%, rgba(248, 248, 248, 0.00) 100%)',
          }}
        ></div>
      </div>

      <div className="z-10 flex flex-col gap-4 px-5 py-6">
        <div className="z-10 h-[25px] w-14 animate-pulse rounded bg-neutral-300" />
        <div className="z-10 flex flex-col gap-2">
          <div className="h-6 w-full animate-pulse rounded bg-neutral-300" />
          <div className="h-6 w-[200px] animate-pulse rounded bg-neutral-300" />
        </div>
        {[1, 2, 3].map((index) => (
          <QuestionAnswerSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}

export default PostAnswerCardSkeleton
