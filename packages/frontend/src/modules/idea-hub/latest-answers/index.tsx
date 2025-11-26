import AnswerCard from './answer-card'

function LatestAnswers() {
  const answers = [
    {
      content: '這是一個回答',
      memberName: '張三2',
      likesCount: 10,
    },
    {
      content: '這是一個回答',
      memberName: '張三3張三3張三3張三3張三3張三3張三3張三3張三3張三3',
      likesCount: 100,
    },
    {
      content:
        '這是一個回答這是一個回答這是一個回答這是一個回答這是一個回答這是一個回答這是一個回答這是一個回答這是一個回答這是一個回答這是一個回答這是一個回答這是一個回答這是一個回答這是一個回答這是一個回答這是一個回答',
      memberName: '張三4',
      likesCount: 10,
    },
  ]
  return (
    <div className="mt-10 mb-14 flex w-[calc(100%+48px)] flex-col gap-8 tablet:mb-16 tablet:w-full desktop:mt-18 desktop:mb-24 hd:mt-24 hd:mb-30">
      <div className="flex items-center gap-3 pl-8 tablet:pl-0">
        <div className="h-8 w-1.5 rounded-md bg-yellow-400" />
        <h3 className="prose-h3-small font-swei text-neutral-900 desktop:prose-h3-large">
          最新回答
        </h3>
      </div>
      <div className="flex gap-6 overflow-x-auto px-8 tablet:grid tablet:grid-cols-3 tablet:overflow-x-hidden tablet:px-0">
        {answers.length > 0 ? (
          answers.map((answer) => (
            <div key={answer.content} className="flex-1">
              <AnswerCard {...answer} />
            </div>
          ))
        ) : (
          <div className="flex w-full items-center justify-center py-12">
            <p className="prose-p1 text-neutral-500">尚無回答</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LatestAnswers
