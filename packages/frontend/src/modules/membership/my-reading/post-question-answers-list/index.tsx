import { cn } from '@kids-reporter/routing-ui'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/accordion'

import { PostQuestionAnswers } from '../../types'
import QuestionAnswersListContent from './question-answers-list-content'

type PostQuestionAnswersListProps = {
  postQuestionAnswers: PostQuestionAnswers
  isLoading: boolean
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    return ''
  }
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}/${month}/${day}`
}

function PostQuestionAnswersList({
  postQuestionAnswers,
  isLoading,
}: PostQuestionAnswersListProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-50 w-full items-center justify-center">
        <p className="prose-p1 text-neutral-500">載入中...</p>
      </div>
    )
  }

  if (postQuestionAnswers.length === 0) {
    return (
      <div className="flex min-h-50 w-full items-center justify-center">
        <p className="prose-p1 text-neutral-500">
          尚無回答紀錄，
          <br />
          歡迎前往文章頁進行互動測驗。
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="mx-auto h-px w-full bg-neutral-200 desktop:w-[calc(100%-40px)]"></div>
      <Accordion type="multiple" className="flex w-full flex-col gap-0">
        {postQuestionAnswers.map((group) => {
          return (
            <AccordionItem
              key={group.title}
              value={group.title}
              className="border-none"
            >
              <AccordionTrigger
                className={cn(
                  'group flex cursor-pointer items-center gap-4 rounded-none py-5 transition-all duration-300 desktop:px-5',
                  'bg-transparent hover:bg-black/5 active:bg-black/10',
                  'focus-visible:outline-none'
                )}
              >
                <div className="flex flex-1 flex-col gap-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="prose-p2 text-neutral-500">
                      {formatDate(group.lastAnsweredTime)}
                    </span>
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.5 prose-p3-bold',
                        'bg-neutral-200 text-neutral-600'
                      )}
                    >
                      共作答 {group.answers.length} 題
                    </span>
                  </div>
                  <h3 className="prose-p1-bold text-neutral-900">
                    {group.title}
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-10 desktop:px-5">
                <QuestionAnswersListContent
                  href={group.href}
                  answers={group.answers}
                />
              </AccordionContent>
              <div className="mx-auto h-px w-full bg-neutral-200 desktop:w-[calc(100%-40px)]"></div>
            </AccordionItem>
          )
        })}
      </Accordion>
    </>
  )
}

export default PostQuestionAnswersList
