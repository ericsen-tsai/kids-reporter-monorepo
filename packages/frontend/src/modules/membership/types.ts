import { PostChoiceAnswer, PostEssayAnswer } from '__generated__/types'
import { z } from 'zod'

export type PostQuestionAnswers = {
  title: string
  slug: string
  href: string
  answers: (PostChoiceAnswer | PostEssayAnswer)[]
  lastAnsweredTime: string
}[]

export const accountFormSchema = z.object({
  name: z.string().min(1, '請輸入全名'),
  nickname: z.string().optional(),
  contactEmail: z.union([z.email('請輸入有效的電子郵件格式'), z.literal('')]),
  avatarUrl: z.url().optional(),
})

export type AccountFormData = z.infer<typeof accountFormSchema>
