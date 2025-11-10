import { GetMemberPostsWithAnswersQuerySchema } from '@/api/extended'

import { PostQuestionAnswers } from '../types'

export function parseMemberPostsWithAnswersToPostQuestionAnswers(
  memberPostsWithAnswers: GetMemberPostsWithAnswersQuerySchema['getMemberPostsWithAnswers']
): PostQuestionAnswers {
  return memberPostsWithAnswers.posts.map((post) => {
    const answers = [...post.choiceAnswers, ...post.essayAnswers]

    return {
      title: post.title,
      href: `/article/${post.slug}`,
      lastAnsweredTime: post.lastAnsweredTime,
      answers,
    }
  })
}
