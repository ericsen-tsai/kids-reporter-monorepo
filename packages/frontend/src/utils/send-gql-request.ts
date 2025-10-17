import errors from '@twreporter/errors'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { print } from 'graphql/language/printer'
import gql from 'graphql-tag'

import { API_URL, INTERNAL_API_URL } from '@/constants'
import envVars from '@/environment-variables'

import { log, LogLevel } from './log'

export const AXIOS_TIMEOUT = 5000

type GraphQLRequest<T = Record<string, unknown>> = {
  // query can be string for backwards compatibility with old code
  query: ReturnType<typeof gql> | string
  variables?: T
  operationName?: string
}

type GraphQLResponse<TData = Record<string, unknown>> = {
  data?: TData
  errors?: Array<{
    message: string
    locations?: Array<{ line: number; column: number }>
    path?: Array<string | number>
    extensions?: Record<string, unknown>
  }>
  extensions?: Record<string, unknown>
}

export const sendGQLRequest = async <
  TResponseData extends Record<string, unknown> = Record<string, unknown>,
  TRequestData extends GraphQLRequest<Record<string, unknown>> = GraphQLRequest<
    Record<string, unknown>
  >,
>(
  data: TRequestData,
  config?: AxiosRequestConfig<TRequestData> | undefined
) => {
  let url
  if (typeof window === 'undefined' && !envVars.isProduction) {
    url = INTERNAL_API_URL
  } else {
    url = API_URL
  }

  let response
  try {
    response = await axios.post(
      url,
      {
        ...data,
        query: typeof data.query === 'string' ? data.query : print(data.query),
      },
      {
        timeout: AXIOS_TIMEOUT,
        ...config,
      }
    )
  } catch (err) {
    const annotatedErr = errors.helpers.annotateAxiosError(err)
    const msg = errors.helpers.printAll(annotatedErr, {
      withStack: true,
      withPayload: true,
    })
    log(LogLevel.ERROR, msg)
  }

  const gqlResponse = response?.data as GraphQLResponse<TResponseData>
  const gqlErrors = gqlResponse?.errors

  if (gqlErrors) {
    const annotatedErr = errors.helpers.wrap(
      new Error(`Errors occured while executing GQL query: ${data.query}`),
      'GraphQLError',
      'Errors occured after axios request',
      { errors: gqlErrors }
    )
    const msg = errors.helpers.printAll(annotatedErr, {
      withStack: true,
      withPayload: true,
    })
    log(LogLevel.ERROR, msg)
  }

  return response as AxiosResponse<GraphQLResponse<TResponseData>>
}
