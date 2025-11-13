import Link from 'next/link'

import { ArticleShortcutIcon, GroupIcon, LightbulbIcon } from '@/icons'

import { PostQuestionAnswers } from '../../types'
import ChoiceAnswerItem from './choice-answer-item'
import EssayAnswerItem from './essay-answer-item'

type QuestionAnswersListContentProps = {
  answers: PostQuestionAnswers[number]['answers']
  href: string
}

function QuestionAnswersListContent({
  href,
  answers,
}: QuestionAnswersListContentProps) {
  if (answers.length === 0) {
    return (
      <div className="flex w-full items-center justify-center py-20">
        <p className="prose-p1 text-neutral-500">尚無回答記錄</p>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {answers.map((answer) => {
        const questionTitle = answer.question?.title
        const isEssayAnswer = 'likesCount' in answer
        const isChoiceAnswer = 'choiceIndex' in answer
        return (
          <div
            key={answer.id}
            className="flex w-full flex-col gap-3 rounded-2xl bg-neutral-200 p-5"
          >
            <div className="flex items-center gap-2">
              <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center text-neutral-900">
                <LightbulbIcon />
              </div>
              <h3 className="flex-1 prose-p1-bold text-neutral-900">
                {questionTitle}
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              {isEssayAnswer && <EssayAnswerItem answer={answer} />}
              {isChoiceAnswer && <ChoiceAnswerItem answer={answer} />}
            </div>
          </div>
        )
      })}
      <div className="mt-3 flex items-center justify-center gap-5">
        <Link
          href={href}
          className="flex items-center gap-1 text-neutral-900 hover:text-red-400 active:text-red-500"
        >
          <ArticleShortcutIcon />
          <span>閱讀完整文章</span>
        </Link>
        <div className="h-4 w-px bg-neutral-900"></div>
        <Link
          href={href}
          className="flex items-center gap-1 text-neutral-900 hover:text-red-400 active:text-red-500"
        >
          <GroupIcon />
          <span>前往讀者討論</span>
        </Link>
      </div>
    </div>
  )
}

export default QuestionAnswersListContent
