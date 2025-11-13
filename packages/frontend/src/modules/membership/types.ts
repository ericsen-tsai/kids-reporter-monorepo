import { PostChoiceAnswer, PostEssayAnswer } from '__generated__/types'
import { z } from 'zod'

export type PostQuestionAnswers = {
  title: string
  href: string
  answers: (PostChoiceAnswer | PostEssayAnswer)[]
  lastAnsweredTime: string
}[]

export const accountFormSchema = z.object({
  name: z.string().min(1, '請輸入全名'),
  nickname: z.string(),
  email: z.email('請輸入有效的電子郵件格式'),
  avatar: z.string(),
})

export type AccountFormData = z.infer<typeof accountFormSchema>
