import { PostEssayAnswer } from '__generated__/types'

import Divider from '@/components/divider'
import { ThumbUpIcon } from '@/icons/miscellaneous'

function EssayAnswerItem({ answer }: { answer: PostEssayAnswer }) {
  const validCount = answer.likesCount ?? 0
  const likesCount = validCount > 99 ? '99+' : validCount
  return (
    <div className="flex gap-4 rounded-xl bg-white px-5 py-4">
      <p className="prose-p1-medium text-neutral-900">{answer.content || ''}</p>
      <Divider direction="vertical" className="ml-auto self-stretch" />
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
