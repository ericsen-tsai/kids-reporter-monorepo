import { GetPostQuery } from '__generated__/operations/post.generated'

import { RecursiveNonNullable } from '@/types/utils'

export type AuthorGroup = {
  title: string
  authors: {
    name: string
    link: string
  }[]
}

export type Keyword = RecursiveNonNullable<
  GetPostQuery['post']
>['tagsOrdered'][number]
