import { PostEssayAnswer } from '__generated__/types'

import { ThumbUpIcon } from '@/icons/miscellaneous'

function EssayAnswerItem({ answer }: { answer: PostEssayAnswer }) {
  const likesCount = (answer.likesCount ?? 0) > 99 ? '99+' : answer.likesCount
  return (
    <div key={answer.id} className="flex gap-4 rounded-xl bg-white px-5 py-4">
      <p className="prose-p1-medium text-neutral-900">{answer.content || ''}</p>
      <div className="ml-auto w-px self-stretch bg-neutral-200" />
      <div className="flex flex-col items-center gap-1">
        <div className="text-neutral-600">
          <ThumbUpIcon />
        </div>
        <span className="prose-p2 text-neutral-600">{likesCount}</span>
      </div>
    </div>
  )
}

export default EssayAnswerItem
