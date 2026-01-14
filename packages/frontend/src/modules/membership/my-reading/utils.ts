import { GetMemberPostsWithAnswersQuerySchema } from '@/api/extended'

import { PostQuestionAnswers } from '../types'

export function parseMemberPostsWithAnswersToPostQuestionAnswers(
  memberPostsWithAnswers: GetMemberPostsWithAnswersQuerySchema['getMemberPostsWithAnswers']['posts']
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
