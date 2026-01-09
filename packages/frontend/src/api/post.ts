import {
  GetLatestPostsQuery,
  GetLatestPostsQueryVariables,
  GetPostEssayQuestionsQuery,
  GetPostMetaQuery,
  GetPostMetaQueryVariables,
  GetPostQuery,
  GetPostQueryVariables,
  GetPostsEssayAnswersWithLikesQuery,
  GetPostsEssayAnswersWithLikesQueryVariables,
} from '__generated__/operations/post.generated'

import { sendGQLRequest } from '@/utils'
import { sendRestGqlRequest } from '@/utils/send-rest-gql'

import {
  GET_POST_ESSAY_QUESTIONS_GQL,
  GET_POSTS_ESSAY_ANSWERS_WITH_LIKES_GQL,
} from './graphql/post'

export const getLatestPosts = async (
  variables: GetLatestPostsQueryVariables
) => {
  const response = await sendRestGqlRequest<GetLatestPostsQuery>({
    operation: 'latest-posts',
    method: 'GET',
    variables,
  })
  return response?.data?.data?.posts
}

export const getPost = async (variables: GetPostQueryVariables) => {
  const response = await sendRestGqlRequest<GetPostQuery>({
    operation: 'post-detail',
    method: 'GET',
    variables,
  })
  return response?.data?.data?.post
}

export const getPostMeta = async (
  variables: GetPostMetaQueryVariables
): Promise<GetPostMetaQuery['post']> => {
  const response = await sendRestGqlRequest<GetPostMetaQuery>({
    operation: 'post-meta',
    method: 'GET',
    variables,
  })
  return response?.data?.data?.post
}

export const getPostsEssayAnswersWithLikes = async (
  variables: GetPostsEssayAnswersWithLikesQueryVariables
) => {
  const response = await sendGQLRequest<GetPostsEssayAnswersWithLikesQuery>({
    query: GET_POSTS_ESSAY_ANSWERS_WITH_LIKES_GQL,
    variables,
  })
  return response?.data?.data?.posts
}

export const getPostEssayQuestionsByPostSlug = async ({
  slug,
}: {
  slug: string
}) => {
  const response = await sendGQLRequest<GetPostEssayQuestionsQuery>({
    query: GET_POST_ESSAY_QUESTIONS_GQL,
    variables: { where: { slug } },
  })
  return response?.data?.data?.post
}
