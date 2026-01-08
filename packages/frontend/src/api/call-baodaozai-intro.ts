import {
  GetCallBaodaozaiIntroQuery,
  GetCallBaodaozaiIntroQueryVariables,
} from '__generated__/operations/call-baodaozai-intro.generated'

import { sendGQLRequest } from '@/utils/send-gql-request'

import { GET_CALL_BAODAOZAI_INTRO_GQL } from './graphql/call-baodaozai-intro'

export async function getCallBaodaozaiIntroContent(
  variables: GetCallBaodaozaiIntroQueryVariables
): Promise<string | undefined> {
  const data = await sendGQLRequest<GetCallBaodaozaiIntroQuery>({
    query: GET_CALL_BAODAOZAI_INTRO_GQL,
    variables,
  })

  return data?.data?.data?.callBaodaozaiIntro?.content ?? undefined
}
