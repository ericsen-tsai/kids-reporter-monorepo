import { V1MemberPostsWithAnswersResponseSchema } from '@kids-reporter/api-types'
import { z } from 'zod'

type MemberPost = z.infer<
  typeof V1MemberPostsWithAnswersResponseSchema
>['posts'][number]
type MemberPostAnswer =
  | MemberPost['choiceAnswers'][number]
  | MemberPost['essayAnswers'][number]

export type PostQuestionAnswers = {
  title: string
  slug: string
  href: string
  answers: MemberPostAnswer[]
  lastAnsweredTime: string
}[]

export const accountFormSchema = z.object({
  name: z.string().min(1, '請輸入全名'),
  nickname: z.string().optional(),
  contactEmail: z.union([z.email('請輸入有效的電子郵件格式'), z.literal('')]),
  avatarUrl: z.url().optional(),
})

export type AccountFormData = z.infer<typeof accountFormSchema>
