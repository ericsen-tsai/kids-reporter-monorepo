import {
  GetTopicProjectsQuery,
  GetTopicProjectsQueryVariables,
} from '__generated__/operations/project.generated'

import { sendGQLRequest } from '@/utils'

import { GET_TOPIC_PROJECTS_GQL } from './graphql/project'

export const getTopicProjects = async (
  variables: GetTopicProjectsQueryVariables
) => {
  const response = await sendGQLRequest<GetTopicProjectsQuery>({
    query: GET_TOPIC_PROJECTS_GQL,
    variables,
  })

  return response?.data?.data?.projects
}
