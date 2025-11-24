import { getFormattedDate } from '@/utils/get-formatted-date'

type ViewModeProps = {
  name: string
  nickname: string
  id: string
  email: string
  joinedAt: string
}

function ViewMode({ name, nickname, id, email, joinedAt }: ViewModeProps) {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="prose-p1-bold text-neutral-900">全名</span>
            <span className="prose-p1 text-neutral-700">{name}</span>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-neutral-200" />

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="prose-p1-bold text-neutral-900">暱稱</span>
            <span className="prose-p1 text-neutral-700">{nickname}</span>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-neutral-200" />

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="prose-p1-bold text-neutral-900">會員帳號</span>
            <span className="prose-p1 text-neutral-700">{id}</span>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-neutral-200" />

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="prose-p1-bold text-neutral-900">聯絡信箱</span>
            <span className="prose-p1 text-neutral-700">{email}</span>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-neutral-200" />

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="prose-p1-bold text-neutral-900">加入日期</span>
            <span className="prose-p1 text-neutral-700">
              {getFormattedDate(joinedAt, '/')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewMode
