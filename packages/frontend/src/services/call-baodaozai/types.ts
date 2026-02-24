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

export type BaodaozaiQuestions = BaodaozaiQuestion[]

export type GeneralBaodaozaiState =
  | 'default'
  | 'idel-sleep'
  | 'idel-read'
  | 'idel-enlighten'
  | 'dialog-speaker'
  | 'dialog-read'
  | 'dialog-enlighten'

export type QaBaodaozaiState =
  | 'default'
  | 'enlighten-send'
  | 'enlighten-fault'
  | 'enlighten-correct'
  | 'enlighten-ask'
