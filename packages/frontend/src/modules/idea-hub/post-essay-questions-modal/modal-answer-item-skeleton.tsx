function ModalAnswerListSkeleton() {
  return (
    <div className="min-w-0">
      <div className="flex min-w-0 flex-col gap-2 rounded-[12px]">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <div className="flex max-w-full min-w-0 flex-1 items-center gap-2 overflow-hidden">
            <div className="size-10 flex-shrink-0 animate-pulse rounded-full bg-neutral-200" />
            <div className="h-5 w-24 animate-pulse rounded bg-neutral-200" />
          </div>
          <div className="flex w-14 items-center gap-1">
            <div className="size-5 animate-pulse rounded bg-neutral-200" />
            <div className="h-5 w-8 animate-pulse rounded bg-neutral-200" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-6 w-full animate-pulse rounded bg-neutral-200" />
          <div className="h-6 w-3/4 animate-pulse rounded bg-neutral-200" />
        </div>
      </div>
    </div>
  )
}

export default ModalAnswerListSkeleton
