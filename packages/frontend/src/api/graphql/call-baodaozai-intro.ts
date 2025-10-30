import gql from 'graphql-tag'

export const GET_CALL_BAODAOZAI_INTRO_GQL = gql`
  query GetCallBaodaozaiIntro($where: CallBaodaozaiIntroWhereUniqueInput!) {
    callBaodaozaiIntro(where: $where) {
      page
      content
    }
  }
`
