function AnswerCardSkeleton() {
  return (
    <div className="flex min-h-[182px] w-75 flex-col justify-between rounded-2xl border-2 border-neutral-200 bg-neutral-100 p-5 shadow-[0px_0px_3px_0px_rgba(0,0,0,0.12)] tablet:w-full">
      <div className="flex flex-col gap-2">
        <div className="h-6 w-full animate-pulse rounded bg-neutral-200" />
        <div className="h-6 w-4/5 animate-pulse rounded bg-neutral-200" />
        <div className="h-6 w-3/5 animate-pulse rounded bg-neutral-200" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center gap-2 truncate">
          <div className="size-10 flex-shrink-0 animate-pulse rounded-full bg-neutral-200" />
          <div className="h-5 w-24 animate-pulse rounded bg-neutral-200" />
        </div>
        <div className="flex w-14 items-center gap-1">
          <div className="size-5 animate-pulse rounded bg-neutral-200" />
          <div className="h-5 w-8 animate-pulse rounded bg-neutral-200" />
        </div>
      </div>
    </div>
  )
}

export default AnswerCardSkeleton
