export type BaodaozaiAction = 'speak' | 'none' | 'timer'

export type BaodaozaiActionSetter = ({
  setHide,
  setIsActive,
  setAction,
}: {
  setHide: (hide: boolean) => void
  setIsActive: (isActive: boolean) => void
  setAction: (action: BaodaozaiAction) => void
}) => void

export type BaodaozaiEssayQuestion = {
  id: string
  type: 'essay'
  title: string
  hint: string
  defaultAnswer?: string
}

export type BaodaozaiChoiceQuestion = {
  id: string
  type: 'choice'
  title: string
  reason: string
  options: {
    content: string
    isCorrectAnswer: boolean
  }[]
}

export type BaodaozaiQuestion = BaodaozaiEssayQuestion | BaodaozaiChoiceQuestion

// only support 3 questions (default flow) or 1 question (update flow) for now
export type BaodaozaiQuestions =
  | [BaodaozaiQuestion, BaodaozaiQuestion, BaodaozaiQuestion]
  | [BaodaozaiQuestion]
