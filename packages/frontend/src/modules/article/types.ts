import type { V1PostDetailBodySchema } from '@kids-reporter/api-types'
import type { z } from 'zod'

import { AuthorRole } from '@/constants'
import { RecursiveNonNullable } from '@/types/utils'

export type ArticlePost = z.infer<typeof V1PostDetailBodySchema>

export type AuthorGroup = {
  title: string
  authors: {
    name: string
    link: string
  }[]
}

export type Keyword = RecursiveNonNullable<ArticlePost>['tagsOrdered'][number]

export type Author = Omit<
  RecursiveNonNullable<ArticlePost>['authors'][number],
  'slug' | 'avatar'
> & {
  role: AuthorRole
  roleName?: string
  slug?: string
  avatar: string
}
