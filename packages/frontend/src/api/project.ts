import { getTopicProjectsContentApi } from '@/api/content-api/project'
import { getProjectsListContentApi } from '@/api/content-api/projects-paged'

export const getTopicProjects = async (
  { take }: { take?: number },
  traceHeaders?: Record<string, string>
) => {
  return await getTopicProjectsContentApi({ take, traceHeaders })
}

export const getTopicProjectsPaged = async (
  {
    take,
    skip,
    includeRelatedPosts,
  }: {
    take?: number
    skip?: number
    includeRelatedPosts?: boolean
  },
  traceHeaders?: Record<string, string>
) => {
  return await getProjectsListContentApi({
    take,
    skip,
    includeRelatedPosts,
    traceHeaders,
  })
}
