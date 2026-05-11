import type { V1MemberPostsWithAnswersResponseSchema } from '@kids-reporter/api-types'
import type { z } from 'zod'

import { PostQuestionAnswers } from '../types'

export function parseMemberPostsWithAnswersToPostQuestionAnswers(
  memberPostsWithAnswers: z.infer<
    typeof V1MemberPostsWithAnswersResponseSchema
  >['posts']
): PostQuestionAnswers {
  return memberPostsWithAnswers.map((post) => {
    const answers = [...post.choiceAnswers, ...post.essayAnswers]

    return {
      title: post.title,
      slug: post.slug,
      href: `/article/${post.slug}`,
      lastAnsweredTime: post.lastAnsweredTime,
      answers,
    }
  })
}
