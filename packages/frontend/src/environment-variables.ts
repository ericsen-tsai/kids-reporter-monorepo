const internalGqlEndpoint =
  process.env.INTERNAL_GQL_ENDPOINT || 'http://localhost:3001/api/graphql'
const gqlEndpoint =
  process.env.NEXT_PUBLIC_GQL_ENDPOINT || 'http://localhost:3001/api/graphql'
const isProduction = process.env.NEXT_PUBLIC_RELEASE_ENV === 'prod'

const searchAPIKey = process.env.SEARCH_API_KEY || ''
const searchEngineID = process.env.SEARCH_ENGINE_ID || ''

const mockIdToken = process.env.MOCK_ID_TOKEN || ''

const environmentVariables = {
  internalGqlEndpoint,
  gqlEndpoint,
  isProduction,
  searchAPIKey,
  searchEngineID,
  mockIdToken,
}

export default environmentVariables
