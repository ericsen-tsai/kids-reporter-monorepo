import { graphql } from '@keystone-6/core'
import axios from 'axios'
import { convertFromRaw } from 'draft-js'

import envVar from '../environment-variables'
import type { TypedKeystoneContext } from '../types/context'

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
        async resolve(root, args, ctx: TypedKeystoneContext) {
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
                data: res.data,
                context: {
                  function: 'generatePostQuestions',
                  postId,
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
          } catch (_err: any) {
            const err = _err instanceof Error ? _err : new Error(String(_err))
            // GCP structured logging
            console.log(
              JSON.stringify({
                severity: 'ERROR',
                message:
                  err.stack || err.message || 'generatePostQuestions failed',
                context: {
                  function: 'generatePostQuestions',
                  postId,
                },
              })
            )
            throw err
          }
        },
      }),
    },
    query: {},
    type: {},
  }
})
