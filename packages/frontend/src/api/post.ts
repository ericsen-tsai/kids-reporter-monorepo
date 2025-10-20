import {
  GetLatestPostsQuery,
  GetLatestPostsQueryVariables,
  GetPostMetaQuery,
  GetPostMetaQueryVariables,
  GetPostQuery,
  GetPostQueryVariables,
} from '__generated__/operations/post.generated'

import { sendGQLRequest } from '@/utils'

import {
  GET_LATEST_POSTS_GQL,
  GET_POST_GQL,
  GET_POST_META_GQL,
} from './graphql/post'

export const getLatestPosts = async (
  variables: GetLatestPostsQueryVariables
) => {
  const response = await sendGQLRequest<GetLatestPostsQuery>({
    query: GET_LATEST_POSTS_GQL,
    variables,
  })
  return response?.data?.data?.posts
}

export const getPost = async (variables: GetPostQueryVariables) => {
  const response = await sendGQLRequest<GetPostQuery>({
    query: GET_POST_GQL,
    variables,
  })
  return response?.data?.data?.post
}

export const getPostMeta = async (
  variables: GetPostMetaQueryVariables
): Promise<GetPostMetaQuery['post']> => {
  const response = await sendGQLRequest<GetPostMetaQuery>({
    query: GET_POST_META_GQL,
    variables,
  })
  return response?.data?.data?.post
}
