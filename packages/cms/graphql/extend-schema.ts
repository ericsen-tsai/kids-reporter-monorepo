import { graphql } from '@keystone-6/core'
import { Prisma } from '@prisma/client'
// @ts-ignore `@twreporter/errors` does not have tyepscript definition file yet
import _errors from '@twreporter/errors'
import axios, { AxiosError } from 'axios'
import { convertFromRaw } from 'draft-js'
import { GraphQLError } from 'graphql'

import { RoleEnum } from '../constants/role-enum'
import envVar from '../environment-variables'
import type { Context } from '../types/index'

const systemPrompt = `你是一位具有幽默感的閱讀陪伴精靈和出題助理，請回傳 JSON，格式固定如下：
{
  "opening": string,
  "choices": [
    { "title": string, "options": [string, string, string], "answerIndex": 0|1|2, "reason": string }
  ],
  "essays": [
    { "title": string, "hint": string }
  ]
}

不要輸出任何解說或前後綴文字，只能輸出 JSON。`

function generateUserPrompt(content: string) {
  return `
以下是文章內文的純文字，請依據其內容生成
- 開場白(opening)：請提供100字以內，能引發10歲兒童好奇心的文章預告！
- 三題選擇題(choices)：每題三個選項，並提供正確答案索引和原因
- 三題思辨題(essays)：提供題目和提示

內文：
${content}
`
}

export const extendGraphqlSchema = graphql.extend(() => {
  return {
    mutation: {
      generatePostQuestions: graphql.field({
        type: graphql.nonNull(graphql.Boolean),
        args: {
          postId: graphql.arg({ type: graphql.nonNull(graphql.ID) }),
        },
        async resolve(root, args, ctx: Context) {
          const { postId } = args as { postId: string }
          try {
            const post = await ctx.query.Post.findOne({
              where: { id: postId },
              query: 'content opening',
            })

            const plainContent = convertFromRaw(post.content).getPlainText(',')

            const client = axios.create({
              baseURL: 'https://api.openai.com/v1/chat',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${envVar.openAI.key}`,
                'OpenAI-Organization': envVar.openAI.organization,
                'OpenAI-Project': envVar.openAI.project,
              },
            })

            const body = {
              model: 'gpt-4o-mini',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: generateUserPrompt(plainContent) },
              ],
              response_format: { type: 'json_object' },
              temperature: 0.7,
            }

            const res = await client.post('/completions', body)

            // GCP structured logging
            console.log(
              JSON.stringify({
                severity: 'INFO',
                message: 'generatePostQuestions response',
                context: {
                  function: 'generatePostQuestions',
                  postId,
                  data: res.data,
                },
              })
            )

            const content: string | undefined =
              res?.data?.choices?.[0]?.message?.content
            const parsed: {
              opening?: string
              choices?: [
                {
                  title?: string
                  options?: string[]
                  answerIndex?: number
                  reason?: string
                },
              ]
              essays?: [{ title?: string; hint?: string }]
            } = (() => {
              try {
                return JSON.parse(content || '{}')
              } catch {
                return {}
              }
            })()

            const choices = Array.isArray(parsed?.choices) ? parsed.choices : []
            const essays = Array.isArray(parsed?.essays) ? parsed.essays : []

            if (parsed.opening) {
              const newOpening = post.opening
                ? `${post.opening}
新版內容：${parsed.opening}`
                : parsed.opening

              await ctx.query.Post.updateOne({
                data: { opening: newOpening },
                where: { id: postId },
              })
            }

            for (let i = 0; i < choices.length; i++) {
              const q = choices[i]
              if (!q || typeof q.title !== 'string') {
                continue
              }
              const answerIndex =
                typeof q.answerIndex === 'number' ? q.answerIndex : 0
              const options = (Array.isArray(q.options) ? q.options : []).map(
                (content, idx) => ({
                  content: typeof content === 'string' ? content : '',
                  isCorrectAnswer: answerIndex === idx,
                })
              )
              const reason = typeof q.reason === 'string' ? q.reason : ''
              await ctx.query.PostChoiceQuestion.createOne({
                data: {
                  post: { connect: { id: postId } },
                  title: q.title,
                  options,
                  reason,
                },
                query: 'id',
              })
            }

            for (let i = 0; i < essays.length; i++) {
              const q = essays[i]
              if (!q || typeof q.title !== 'string') {
                continue
              }
              const hint = typeof q.hint === 'string' ? q.hint : ''
              await ctx.query.PostEssayQuestion.createOne({
                data: {
                  post: { connect: { id: postId } },
                  title: q.title,
                  hint,
                },
                query: 'id',
              })
            }

            return true
          } catch (_err) {
            const err = _err instanceof Error ? _err : new Error(String(_err))
            let errorMessage =
              err.stack || err.message || 'generatePostQuestions failed'

            if (_err instanceof AxiosError) {
              const annotatedErr = _errors.helpers.annotateAxiosError(_err)
              errorMessage = _errors.helpers.printAll(annotatedErr, {
                withStack: true,
                withPayload: true,
              })
            }

            // GCP structured logging
            console.log(
              JSON.stringify({
                severity: 'ERROR',
                message: errorMessage,
                context: {
                  function: 'generatePostQuestions',
                  postId,
                },
              })
            )

            throw new GraphQLError(
              'Internal server error while generating post questions',
              {
                extensions: {
                  code: 'INTERNAL_SERVER_ERROR',
                  http: {
                    status: 500,
                  },
                },
              }
            )
          }
        },
      }),
    },
    query: {
      searchTWReporterPosts: graphql.field({
        type: graphql.list(graphql.JSON),
        args: {
          keywords: graphql.arg({ type: graphql.nonNull(graphql.String) }),
        },
        async resolve(root, args, ctx: Context) {
          const { keywords } = args

          const session = ctx.session
          const isUnauthorized = !session
          const isForbidden = ![
            RoleEnum.Admin,
            RoleEnum.Contributor,
            RoleEnum.Editor,
            RoleEnum.Developer,
            RoleEnum.Owner,
          ].includes(session?.data?.role ?? '')

          if (isUnauthorized || isForbidden) {
            const errorMessage = isUnauthorized
              ? 'Unauthorized to search TW Reporter posts'
              : 'Forbidden to search TW Reporter posts'

            const errorCode = isUnauthorized ? 'UNAUTHENTICATED' : 'FORBIDDEN'

            console.log(
              JSON.stringify({
                severity: 'WARNING',
                message: errorMessage,
                context: {
                  function: 'searchTWReporterPosts',
                  keywords,
                  errorCode,
                },
              })
            )

            throw new GraphQLError(errorMessage, {
              extensions: {
                code: errorCode,
                http: {
                  status: isUnauthorized ? 401 : 403,
                },
              },
            })
          }

          if (!keywords || !envVar.searchAPIKey || !envVar.twreporterID) {
            return []
          }

          const customSearchURL = `https://www.googleapis.com/customsearch/v1?key=${envVar.searchAPIKey}&cx=${envVar.twreporterID}`

          try {
            const response = await axios.get(`${customSearchURL}&q=${keywords}`)
            const posts = response?.data?.items
              ?.filter(
                (item: any) =>
                  item?.link?.match('^https://www.twreporter.org/') &&
                  (item?.pagemap?.metatags?.[0]['og:type'] === 'article' ||
                    item?.link?.includes('/topics/'))
              )
              ?.map((item: any) => {
                const metaTag = item?.pagemap?.metatags?.[0]
                const publishedDate = new Date(
                  item?.snippet
                    ?.split('...')?.[0]
                    .trim()
                    .replace('年', '-')
                    .replace('月', '-')
                    .replace('日', '')
                ).toISOString()

                return {
                  src: item.link,
                  ogImgSrc: metaTag['og:image'],
                  ogTitle: metaTag['og:title'],
                  ogDescription: metaTag['og:description'],
                  publishedDate,
                }
              })

            console.log(
              JSON.stringify({
                severity: 'INFO',
                message: 'searchTWReporterPosts response',
                context: {
                  function: 'searchTWReporterPosts',
                  keywords,
                  data: response.data,
                },
              })
            )

            return posts || []
          } catch (_err) {
            let errorMessage = 'searchTWReporterPosts failed'
            if (_err instanceof AxiosError) {
              const annotatedErr = _errors.helpers.annotateAxiosError(_err)
              errorMessage = _errors.helpers.printAll(annotatedErr, {
                withStack: true,
                withPayload: true,
              })
            }

            console.log(
              JSON.stringify({
                severity: 'ERROR',
                message: errorMessage,
                context: {
                  function: 'searchTWReporterPosts',
                  keywords,
                },
              })
            )

            throw new GraphQLError(
              'Internal server error while searching TW Reporter posts',
              {
                extensions: {
                  code: 'INTERNAL_SERVER_ERROR',
                  http: {
                    status: 500,
                  },
                },
              }
            )
          }
        },
      }),
      getMemberPostsWithAnswers: graphql.field({
        type: graphql.JSON,
        args: {
          memberId: graphql.arg({ type: graphql.nonNull(graphql.ID) }),
          take: graphql.arg({ type: graphql.Int, defaultValue: 5 }),
          cursor: graphql.arg({ type: graphql.String }),
        },
        async resolve(root, args, ctx: Context) {
          const { memberId, take = 5, cursor } = args

          const session = ctx.session
          const isUnauthorized = !session
          const isForbidden = ![RoleEnum.Admin, RoleEnum.Member].includes(
            session?.data?.role ?? ''
          )

          if (isUnauthorized || isForbidden) {
            const errorMessage = isUnauthorized
              ? 'Unauthorized to get member posts with answers'
              : 'Forbidden to get member posts with answers'

            const errorCode = isUnauthorized ? 'UNAUTHENTICATED' : 'FORBIDDEN'

            console.log(
              JSON.stringify({
                severity: 'WARNING',
                message: errorMessage,
                context: {
                  function: 'getMemberPostsWithAnswers',
                  memberId,
                  take,
                  cursor,
                  errorCode,
                },
              })
            )

            throw new GraphQLError(errorMessage, {
              extensions: {
                code: errorCode,
                http: {
                  status: isUnauthorized ? 401 : 403,
                },
              },
            })
          }

          const takeValue = take ?? 5

          try {
            const whereClause = cursor
              ? Prisma.sql`WHERE pla.last_answered_time < ${cursor}::timestamp`
              : Prisma.empty

            const sqlQuery = Prisma.sql`
              WITH all_answer_times AS (
                SELECT 
                  peq."post" as post_id,
                  COALESCE(pea."updatedAt", pea."createdAt") as answer_time
                FROM "PostEssayAnswer" pea
                INNER JOIN "PostEssayQuestion" peq ON peq.id = pea."question"
                WHERE pea."member" = ${memberId}
                
                UNION ALL
                
                SELECT 
                  pcq."post" as post_id,
                  COALESCE(pca."updatedAt", pca."createdAt") as answer_time
                FROM "PostChoiceAnswer" pca
                INNER JOIN "PostChoiceQuestion" pcq ON pcq.id = pca."question"
                WHERE pca."member" = ${memberId}
              ),
              post_last_answered AS (
                SELECT 
                  post_id,
                  MAX(answer_time) as last_answered_time
                FROM all_answer_times
                GROUP BY post_id
              )
              SELECT 
                p.id,
                p.title,
                p.slug,
                p."publishedDate" as published_date,
                pla.last_answered_time
              FROM "Post" p
              INNER JOIN post_last_answered pla ON pla.post_id = p.id
              ${whereClause}
              ORDER BY pla.last_answered_time DESC
              LIMIT ${takeValue + 1}
            `

            const postsWithLastAnsweredTime = await ctx.prisma.$queryRaw<
              Array<{
                id: number
                title: string
                slug: string
                published_date: Date | null
                last_answered_time: Date
              }>
            >(sqlQuery)

            if (postsWithLastAnsweredTime.length === 0) {
              return { posts: [], nextCursor: null }
            }

            // Check if there's a next page
            const hasNextPage = postsWithLastAnsweredTime.length > takeValue

            const postsToReturn = postsWithLastAnsweredTime.slice(0, takeValue)

            const postIds = postsToReturn.map((p) => p.id.toString())

            const essayAnswersData = await ctx.query.PostEssayAnswer.findMany({
              where: {
                AND: [
                  { member: { id: { equals: memberId } } },
                  { question: { post: { id: { in: postIds } } } },
                ],
              },
              query: `
                id
                content
                likesCount
                createdAt
                updatedAt
                question {
                  id
                  title
                  hint
                  post {
                    id
                  }
                }
              `,
            })

            const choiceAnswersData = await ctx.query.PostChoiceAnswer.findMany(
              {
                where: {
                  AND: [
                    { member: { id: { equals: memberId } } },
                    { question: { post: { id: { in: postIds } } } },
                  ],
                },
                query: `
                id
                choiceIndex
                correct
                createdAt
                updatedAt
                question {
                  id
                  title
                  options
                  reason
                  post {
                    id
                  }
                }
              `,
              }
            )

            const posts = postsToReturn.map((post) => {
              const postId = post.id.toString()
              const essayAnswers = essayAnswersData.filter(
                (a) => a.question?.post?.id?.toString() === postId
              )
              const choiceAnswers = choiceAnswersData.filter(
                (a) => a.question?.post?.id?.toString() === postId
              )

              return {
                id: post.id,
                title: post.title,
                slug: post.slug,
                publishedDate: post.published_date
                  ? post.published_date.toISOString()
                  : null,
                essayAnswers,
                choiceAnswers,
                lastAnsweredTime: post.last_answered_time.toISOString(),
              }
            })

            const nextCursor = hasNextPage
              ? posts[posts.length - 1].lastAnsweredTime
              : null

            return {
              posts,
              nextCursor,
            }
          } catch (err) {
            let errorMessage = 'memberPostsWithAnswers failed'
            if (err instanceof AxiosError) {
              const annotatedErr = _errors.helpers.annotateAxiosError(err)
              errorMessage = _errors.helpers.printAll(annotatedErr, {
                withStack: true,
                withPayload: true,
              })
            }

            console.log(
              JSON.stringify({
                severity: 'ERROR',
                message: 'memberPostsWithAnswers failed',
                context: {
                  function: 'memberPostsWithAnswers',
                  memberId,
                  error: errorMessage,
                },
              })
            )

            throw new GraphQLError(
              'Internal server error while fetching member posts with answers',
              {
                extensions: {
                  code: 'INTERNAL_SERVER_ERROR',
                  http: {
                    status: 500,
                  },
                },
              }
            )
          }
        },
      }),
    },
    type: {},
  }
})
