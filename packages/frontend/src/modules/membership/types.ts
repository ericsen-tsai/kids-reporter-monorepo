import { PostChoiceAnswer, PostEssayAnswer } from '__generated__/types'

export type PostQuestionAnswers = {
  title: string
  href: string
  answers: (PostChoiceAnswer | PostEssayAnswer)[]
  lastAnsweredTime: string
}[]
